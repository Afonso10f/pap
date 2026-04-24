let indice = 0;
let slides = [];
let indicadores = [];
let intervalo;

let pontos = [];
let hoteis = [];

function mostrarSlide() {
  slides.forEach((slide, i) => {
    slide.classList.remove("ativo");
    if (indicadores[i]) indicadores[i].classList.remove("ativo");
  });

  if (slides[indice]) {
    slides[indice].classList.add("ativo");
    if (indicadores[indice]) indicadores[indice].classList.add("ativo");
  }
}

function mudarSlide(direcao) {
  if (!slides.length) return;
  indice += direcao;
  if (indice >= slides.length) indice = 0;
  if (indice < 0) indice = slides.length - 1;
  mostrarSlide();
  clearInterval(intervalo);
  iniciarCarrossel();
}

function irParaSlide(n) {
  if (!slides.length) return;
  indice = n;
  mostrarSlide();
  clearInterval(intervalo);
  iniciarCarrossel();
}

function proximoSlide() {
  if (!slides.length) return;
  indice++;
  if (indice >= slides.length) indice = 0;
  mostrarSlide();
}

function iniciarCarrossel() {
  clearInterval(intervalo);
  intervalo = setInterval(proximoSlide, 5000);
}

function showLocalModal(local) {
  const titulo = document.getElementById("titulo");
  const descricao = document.getElementById("descricao");
  const modal = document.getElementById("modal");
  if (!titulo || !descricao || !modal) return;

  titulo.innerText = local.nome || "";
  descricao.innerText = local.descricao || "";
  modal.style.display = "block";
  clearInterval(intervalo);
}

function fecharModal() {
  const modal = document.getElementById("modal");
  if (!modal) return;
  modal.style.display = "none";
  iniciarCarrossel();
}

function showHotelModal(local) {
  const titulo = document.getElementById("hotelTitulo");
  const descricao = document.getElementById("hotelDescricao");
  const imagem = document.getElementById("hotelImagem");
  const modal = document.getElementById("modalHotel");
  if (!titulo || !descricao || !imagem || !modal) return;

  titulo.innerText = local.nome || "";
  descricao.innerText = local.descricao || "";
  imagem.src = local.imagem || "";
  imagem.alt = local.nome || "";
  modal.style.display = "block";
}

function fecharModalHotel() {
  const modal = document.getElementById("modalHotel");
  if (!modal) return;
  modal.style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("modal");
  const modalHotel = document.getElementById("modalHotel");
  if (event.target === modal) fecharModal();
  if (event.target === modalHotel) fecharModalHotel();
};

function voltarAoTopo() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.onscroll = function () {
  const botao = document.getElementById("voltarTopo");
  if (!botao) return;
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    botao.classList.add("show");
  } else {
    botao.classList.remove("show");
  }
};

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

function safeJsonParseArray(maybeJson) {
  if (!maybeJson) return [];
  try {
    const parsed = JSON.parse(maybeJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function renderPontosCarousel(items) {
  pontos = items.filter((item) => Number(item.mostrar_slider) === 1);

  const carrossel = document.getElementById("pontosCarousel");
  const indicadoresEl = document.getElementById("pontosIndicadores");
  if (!carrossel || !indicadoresEl) return;

  carrossel.innerHTML = "";
  indicadoresEl.innerHTML = "";

  pontos.forEach((local, i) => {
    const slide = document.createElement("div");
    slide.className = "slide" + (i === 0 ? " ativo" : "");
    slide.innerHTML = `
      <img src="${local.imagem || ""}" alt="${local.nome || ""}">
      <div class="slide-overlay">
        <p class="slide-title">${local.nome || ""}</p>
        <p class="slide-subtitle">${local.subtitulo || ""}</p>
      </div>
    `;
    slide.addEventListener("click", () => {
      if (Number(local.categoria_id) === 2) {
        showHotelModal(local);
        return;
      }
      showLocalModal(local);
    });
    carrossel.appendChild(slide);

    const ind = document.createElement("span");
    ind.className = "indicador" + (i === 0 ? " ativo" : "");
    ind.addEventListener("click", () => irParaSlide(i));
    indicadoresEl.appendChild(ind);
  });

  slides = Array.from(document.querySelectorAll(".slide"));
  indicadores = Array.from(document.querySelectorAll(".indicador"));
  indice = 0;
  if (!slides.length) {
    clearInterval(intervalo);
    return;
  }
  mostrarSlide();
  iniciarCarrossel();
}

function renderHoteis(items) {
  hoteis = items;
  const grid = document.getElementById("hoteisGrid");
  if (!grid) return;

  grid.innerHTML = "";

  items.forEach((local) => {
    const tags = safeJsonParseArray(local.extras_json);
    const tagsHtml = tags
      .slice(0, 6)
      .map((t) => `<span class="service-tag">${t}</span>`)
      .join("");

    const badge = local.subtitulo || "Hotel";
    const preco = local.preco || "";

    const card = document.createElement("div");
    card.className = "hotel-card";
    card.innerHTML = `
      <div class="hotel-image">
        <img src="${local.imagem || ""}" alt="${local.nome || ""}">
        <div class="hotel-badge">${badge}</div>
      </div>
      <div class="hotel-content">
        <h3>${local.nome || ""}</h3>
        <p class="hotel-location">📍 ${local.distrito || ""}</p>
        <div class="hotel-services">${tagsHtml}</div>
        <div class="hotel-price">
          <span class="price-label">A partir de</span>
          <span class="price-value">${preco || "-"}</span>
        </div>
        <button class="btn-hotel" type="button">Ver Detalhes</button>
      </div>
    `;

    const btn = card.querySelector(".btn-hotel");
    btn.addEventListener("click", () => showHotelModal(local));
    grid.appendChild(card);
  });

  const elementos = document.querySelectorAll(".hotel-card, .fact, .historia-text");
  elementos.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text ?? "";
}

function loadConteudoToPage(itens) {
  const map = {};
  itens.forEach((i) => (map[i.chave] = i.valor));

  setText("heroTitle", map.hero_title || "Descubra São Tomé e Príncipe");
  setText("heroSubtitle", map.hero_subtitle || "Um paraíso tropical no coração do Atlântico");

  setText("historiaTitle", map.historia_title || "Um Pouco da História");
  setText("historiaP1", map.historia_p1 || "");
  setText("historiaP2", map.historia_p2 || "");

  setText("footerTitle", map.footer_title || "Turismo São Tomé e Príncipe");
  setText("footerSubtitle", map.footer_subtitle || "");
  setText("footerEmail", `📧 ${map.footer_email || ""}`);
  setText("footerPhone", `📞 ${map.footer_phone || ""}`);

  const year = new Date().getFullYear();
  setText("footerCopyright", `© ${year} Turismo em São Tomé e Príncipe. Todos os direitos reservados.`);
}

async function init() {
  try {
    const conteudo = await fetchJson("api/conteudo.php");
    loadConteudoToPage(Array.isArray(conteudo) ? conteudo : []);
  } catch {
    loadConteudoToPage([]);
  }

  try {
    const pontosData = await fetchJson("api/locais.php?slider=1");
    renderPontosCarousel(Array.isArray(pontosData) ? pontosData : []);
  } catch {
    renderPontosCarousel([]);
  }

  try {
    const hoteisData = await fetchJson("api/locais.php?categoria_id=2");
    renderHoteis(Array.isArray(hoteisData) ? hoteisData : []);
  } catch {
    renderHoteis([]);
  }
}

window.addEventListener("DOMContentLoaded", init);
