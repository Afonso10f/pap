function qs(sel) {
  return document.querySelector(sel);
}

function setMsg(el, text, kind) {
  if (!el) return;
  el.textContent = text || "";
  el.className = "msg" + (kind ? " " + kind : "");
}

function getServeHint() {
  const path = window.location.pathname.replace(/\\/g, "/");
  const project = path.split("/").filter(Boolean).slice(-2, -1)[0] || "12E_PAP_Afonso";
  return `http://localhost/${project}/admin.html`;
}

async function fetchJson(url, opts = {}) {
  const headers = { Accept: "application/json", ...(opts.headers || {}) };
  const isFormData = typeof FormData !== "undefined" && opts.body instanceof FormData;
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    credentials: "same-origin",
    headers,
    ...opts,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data && data.erro ? data.erro : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

function toExtrasJson(csv) {
  const list = (csv || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return JSON.stringify(list);
}

function fromExtrasJson(maybeJson) {
  if (!maybeJson) return "";
  try {
    const arr = JSON.parse(maybeJson);
    return Array.isArray(arr) ? arr.join(", ") : "";
  } catch {
    return "";
  }
}

let categorias = [];
let locais = [];

async function authMe() {
  return fetchJson("api/auth.php?action=me", { method: "GET" });
}

async function authLogin(pin) {
  return fetchJson("api/auth.php?action=login", { method: "POST", body: JSON.stringify({ pin }) });
}

async function authLogout() {
  return fetchJson("api/auth.php?action=logout", { method: "POST", body: "{}" });
}

async function loadCategorias() {
  categorias = await fetchJson("api/categorias.php", { method: "GET" });
  if (!Array.isArray(categorias)) categorias = [];

  const sel = qs("#localCategoria");
  if (sel) {
    sel.innerHTML = "";
    categorias.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = `${c.nome}`;
      sel.appendChild(opt);
    });
  }

  const tbody = qs("#categoriasTbody");
  if (tbody) {
    tbody.innerHTML = "";
    categorias.forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${c.id}</td>
        <td>${c.nome}</td>
        <td>
          <button class="btn btn-ghost" data-act="edit" data-id="${c.id}" type="button">Editar</button>
          <button class="btn btn-danger" data-act="del" data-id="${c.id}" type="button">Apagar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
}

async function loadLocais() {
  locais = await fetchJson("api/locais.php", { method: "GET" });
  if (!Array.isArray(locais)) locais = [];

  const tbody = qs("#locaisTbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const catName = (id) => (categorias.find((c) => Number(c.id) === Number(id)) || {}).nome || id;

  locais.forEach((l) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${l.id}</td>
      <td>${l.nome || ""}</td>
      <td>${catName(l.categoria_id)}</td>
      <td>${l.distrito || ""}</td>
      <td>${Number(l.mostrar_slider) === 1 ? "Sim" : "Nao"}</td>
      <td>
        <button class="btn btn-ghost" data-act="edit" data-id="${l.id}" type="button">Editar</button>
        <button class="btn btn-danger" data-act="del" data-id="${l.id}" type="button">Apagar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function loadConteudo() {
  const itens = await fetchJson("api/conteudo.php", { method: "GET" });
  const tbody = qs("#conteudoTbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  (Array.isArray(itens) ? itens : []).forEach((i) => {
    const prev = (i.valor || "").toString().slice(0, 60);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i.chave}</td>
      <td class="muted">${prev}${(i.valor || "").length > 60 ? "…" : ""}</td>
      <td><button class="btn btn-ghost" data-act="edit" data-key="${i.chave}" type="button">Editar</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function resetLocalForm() {
  qs("#localId").value = "";
  qs("#localNome").value = "";
  qs("#localSubtitulo").value = "";
  qs("#localDescricao").value = "";
  qs("#localDistrito").value = "";
  qs("#localIcone").value = "";
  qs("#localPreco").value = "";
  qs("#localImagem").value = "";
  qs("#localImagemFile").value = "";
  qs("#localPosX").value = "";
  qs("#localPosY").value = "";
  qs("#localExtras").value = "";
  qs("#localMostrarSlider").checked = false;
  setMsg(qs("#localMsg"), "", "");
}

function fillLocalForm(local) {
  qs("#localId").value = local.id || "";
  qs("#localNome").value = local.nome || "";
  qs("#localSubtitulo").value = local.subtitulo || "";
  qs("#localDescricao").value = local.descricao || "";
  qs("#localDistrito").value = local.distrito || "";
  qs("#localCategoria").value = local.categoria_id || "";
  qs("#localIcone").value = local.icone || "";
  qs("#localPreco").value = local.preco || "";
  qs("#localImagem").value = local.imagem || "";
  qs("#localImagemFile").value = "";
  qs("#localPosX").value = local.pos_x ?? "";
  qs("#localPosY").value = local.pos_y ?? "";
  qs("#localExtras").value = fromExtrasJson(local.extras_json);
  qs("#localMostrarSlider").checked = Number(local.mostrar_slider) === 1;
}

function resetCategoriaForm() {
  qs("#categoriaId").value = "";
  qs("#categoriaNome").value = "";
  setMsg(qs("#categoriaMsg"), "", "");
}

function fillCategoriaForm(cat) {
  qs("#categoriaId").value = cat.id || "";
  qs("#categoriaNome").value = cat.nome || "";
}

function resetConteudoForm() {
  qs("#conteudoChave").value = "";
  qs("#conteudoValor").value = "";
  setMsg(qs("#conteudoMsg"), "", "");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Nao foi possivel ler a imagem selecionada."));
    reader.readAsDataURL(file);
  });
}

async function buildLocalPayload() {
  const id = Number(qs("#localId").value || 0);
  const imagemFile = qs("#localImagemFile").files[0];
  const payload = {
    id: id || undefined,
    nome: qs("#localNome").value.trim(),
    subtitulo: qs("#localSubtitulo").value.trim(),
    descricao: qs("#localDescricao").value.trim(),
    distrito: qs("#localDistrito").value.trim(),
    categoria_id: Number(qs("#localCategoria").value || 0) || 1,
    icone: qs("#localIcone").value.trim(),
    preco: qs("#localPreco").value.trim(),
    imagem: qs("#localImagem").value.trim(),
    pos_x: qs("#localPosX").value === "" ? null : Number(qs("#localPosX").value),
    pos_y: qs("#localPosY").value === "" ? null : Number(qs("#localPosY").value),
    extras_json: toExtrasJson(qs("#localExtras").value),
    mostrar_slider: qs("#localMostrarSlider").checked,
  };

  if (imagemFile) {
    payload.imagem_nome = imagemFile.name;
    payload.imagem_base64 = await readFileAsDataUrl(imagemFile);
  }

  return payload;
}

async function refreshAll() {
  await loadCategorias();
  await loadLocais();
  await loadConteudo();
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      document.querySelectorAll("[data-view]").forEach((view) => {
        view.hidden = view.dataset.view !== tab;
      });
    });
  });
}

async function init() {
  const loginPanel = qs("#loginPanel");
  const appPanel = qs("#appPanel");
  const loginMsg = qs("#loginMsg");
  const btnLogout = qs("#btnLogout");

  if (window.location.protocol === "file:") {
    loginPanel.hidden = false;
    appPanel.hidden = true;
    setMsg(
      loginMsg,
      `Este painel precisa de ser aberto através do Apache/XAMPP. Usa ${getServeHint()} em vez de abrir o ficheiro diretamente.`,
      "err"
    );
    return;
  }

  setupTabs();

  btnLogout.addEventListener("click", async () => {
    try {
      await authLogout();
    } finally {
      appPanel.hidden = true;
      loginPanel.hidden = false;
      setMsg(loginMsg, "Sessão terminada.", "ok");
    }
  });

  qs("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg(loginMsg, "", "");
    const pin = qs("#pinInput").value;
    try {
      await authLogin(pin);
      loginPanel.hidden = true;
      appPanel.hidden = false;
      await refreshAll();
      setMsg(loginMsg, "", "");
    } catch (err) {
      setMsg(loginMsg, err.message, "err");
    }
  });

  // Locais actions
  qs("#btnReloadLocais").addEventListener("click", () => loadLocais());
  qs("#btnLocalReset").addEventListener("click", resetLocalForm);
  qs("#locaisTbody").addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const act = btn.dataset.act;
    const local = locais.find((l) => Number(l.id) === id);
    if (!local) return;

    if (act === "edit") {
      fillLocalForm(local);
      return;
    }
    if (act === "del") {
      if (!confirm(`Apagar "${local.nome}"?`)) return;
      try {
        await fetchJson(`api/locais.php?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        setMsg(qs("#localMsg"), "Eliminado com sucesso.", "ok");
        await loadLocais();
        resetLocalForm();
      } catch (err) {
        setMsg(qs("#localMsg"), err.message, "err");
      }
    }
  });

  qs("#localForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const payload = await buildLocalPayload();
      const id = Number(payload.id || 0);

      if (id > 0) {
        await fetchJson("api/locais.php", { method: "POST", body: JSON.stringify(payload) });
        setMsg(qs("#localMsg"), "Atualizado com sucesso.", "ok");
      } else {
        await fetchJson("api/locais.php", { method: "POST", body: JSON.stringify(payload) });
        setMsg(qs("#localMsg"), "Criado com sucesso.", "ok");
      }
      await loadLocais();
      resetLocalForm();
    } catch (err) {
      setMsg(qs("#localMsg"), err.message, "err");
    }
  });

  // Categorias actions
  qs("#btnReloadCategorias").addEventListener("click", () => loadCategorias());
  qs("#btnCategoriaReset").addEventListener("click", resetCategoriaForm);
  qs("#categoriasTbody").addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const act = btn.dataset.act;
    const cat = categorias.find((c) => Number(c.id) === id);
    if (!cat) return;

    if (act === "edit") {
      fillCategoriaForm(cat);
      return;
    }
    if (act === "del") {
      if (!confirm(`Apagar categoria "${cat.nome}"?`)) return;
      try {
        await fetchJson(`api/categorias.php?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        setMsg(qs("#categoriaMsg"), "Eliminada com sucesso.", "ok");
        await refreshAll();
        resetCategoriaForm();
      } catch (err) {
        setMsg(qs("#categoriaMsg"), err.message, "err");
      }
    }
  });

  qs("#categoriaForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = Number(qs("#categoriaId").value || 0);
    const nome = qs("#categoriaNome").value.trim();
    try {
      if (id > 0) {
        await fetchJson("api/categorias.php", { method: "PUT", body: JSON.stringify({ id, nome }) });
        setMsg(qs("#categoriaMsg"), "Atualizada com sucesso.", "ok");
      } else {
        await fetchJson("api/categorias.php", { method: "POST", body: JSON.stringify({ nome }) });
        setMsg(qs("#categoriaMsg"), "Criada com sucesso.", "ok");
      }
      await refreshAll();
      resetCategoriaForm();
    } catch (err) {
      setMsg(qs("#categoriaMsg"), err.message, "err");
    }
  });

  // Conteudo actions
  qs("#btnReloadConteudo").addEventListener("click", () => loadConteudo());
  qs("#btnConteudoReset").addEventListener("click", resetConteudoForm);
  qs("#conteudoTbody").addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const key = btn.dataset.key;
    if (!key) return;

    try {
      const item = await fetchJson(`api/conteudo.php?chave=${encodeURIComponent(key)}`, { method: "GET" });
      qs("#conteudoChave").value = item.chave || key;
      qs("#conteudoValor").value = item.valor || "";
    } catch (err) {
      setMsg(qs("#conteudoMsg"), err.message, "err");
    }
  });

  qs("#conteudoForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const chave = qs("#conteudoChave").value.trim();
    const valor = qs("#conteudoValor").value;
    try {
      await fetchJson("api/conteudo.php", { method: "PUT", body: JSON.stringify({ chave, valor }) });
      setMsg(qs("#conteudoMsg"), "Guardado com sucesso.", "ok");
      await loadConteudo();
      resetConteudoForm();
    } catch (err) {
      setMsg(qs("#conteudoMsg"), err.message, "err");
    }
  });

  // Boot: detect session
  try {
    const me = await authMe();
    if (me && me.is_admin) {
      loginPanel.hidden = true;
      appPanel.hidden = false;
      await refreshAll();
      return;
    }
  } catch {
    // ignore
  }

  loginPanel.hidden = false;
  appPanel.hidden = true;
}

window.addEventListener("DOMContentLoaded", init);

