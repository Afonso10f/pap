let mergulhoIniciado = false;

const mensagens = [
  "Mergulhando no Paraíso...",
  "Preparando sua Aventura...",
  "Navegando para São Tomé...",
  "Descobrindo as Ilhas...",
  "Iniciando sua Jornada...",
];

function mostrarMensagemAleatoria() {
  const diveText = document.querySelector(".dive-text h2");
  if (!diveText) return;
  const msg = mensagens[Math.floor(Math.random() * mensagens.length)];
  diveText.textContent = msg;
}

function criarParticulas() {
  const loginPage = document.querySelector(".login-page");
  if (!loginPage) return;

  const numParticulas = 20;
  for (let i = 0; i < numParticulas; i++) {
    const particula = document.createElement("div");
    particula.className = "particula-flutuante";
    particula.style.cssText = `
      position: absolute;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: rgba(255, 215, 0, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float-particle ${Math.random() * 10 + 5}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
      pointer-events: none;
    `;
    loginPage.appendChild(particula);
  }
}

function criarParticulasDinamicas() {
  const particlesContainer = document.querySelector(".particles-3d");
  if (!particlesContainer) return;

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement("div");
    particle.className = "particle-3d-dynamic";
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 6 + 3}px;
      height: ${Math.random() * 6 + 3}px;
      background: radial-gradient(circle, rgba(255, 215, 0, 1), rgba(255, 165, 0, 0.5));
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: particle-fly ${Math.random() * 2 + 1}s ease-in-out infinite;
      animation-delay: ${Math.random() * 0.5}s;
      box-shadow: 0 0 15px rgba(255, 215, 0, 0.9);
      pointer-events: none;
    `;
    particlesContainer.appendChild(particle);
  }
}

function iniciarMergulho(e) {
  if (mergulhoIniciado) return;
  mergulhoIniciado = true;

  if (e && e.preventDefault) e.preventDefault();

  mostrarMensagemAleatoria();

  const diveEffect = document.getElementById("diveEffect");
  const loginPage = document.getElementById("loginPage");
  if (!diveEffect || !loginPage) {
    window.location.href = "index.html";
    return;
  }

  loginPage.style.animation = "fadeOutRotate 1s ease-out forwards";
  diveEffect.classList.add("active");

  setTimeout(() => {
    diveEffect.style.animation = "cameraZoom 1.5s ease-in-out forwards";
  }, 500);

  if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

  criarParticulasDinamicas();

  setTimeout(() => {
    window.location.href = "index.html";
  }, 2500);
}

function criarRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement("span");
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    left: ${x}px;
    top: ${y}px;
    transform: scale(0);
    animation: ripple-effect 0.6s ease-out;
    pointer-events: none;
  `;

  button.style.position = "relative";
  button.style.overflow = "hidden";
  button.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}

document.addEventListener("mousemove", function (e) {
  const loginContainer = document.querySelector(".login-container");
  if (!loginContainer) return;

  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  loginContainer.style.transform = `translate(${x}px, ${y}px)`;
  loginContainer.style.transition = "transform 0.3s ease-out";
});

document.addEventListener("DOMContentLoaded", function () {
  criarParticulas();

  const form = document.getElementById("formLogin");
  if (form) {
    form.addEventListener("keydown", function (e) {
      if (e.key === "Enter") iniciarMergulho(e);
    });
  }

  const buttons = document.querySelectorAll(".btn-login, .btn-guest");
  buttons.forEach((b) => b.addEventListener("click", criarRipple));

  // Easter egg: 3 cliques no logo
  let clickCount = 0;
  const logo = document.querySelector(".logo-circle");
  if (logo) {
    logo.addEventListener("click", function () {
      clickCount++;
      if (clickCount === 3) {
        this.style.animation = "spin 1s ease-in-out";
        setTimeout(() => (this.style.animation = "float 3s ease-in-out infinite"), 1000);
        clickCount = 0;
      }
    });
  }

  console.log(
    "%c🏝️ Bem-vindo ao Site de Turismo de São Tomé e Príncipe!",
    "font-size: 18px; color: #006633; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
  );
});

// Keyframes inline (mantém dependências mínimas)
const style = document.createElement("style");
style.textContent = `
@keyframes ripple-effect { to { transform: scale(4); opacity: 0; } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes float-particle {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0; }
  25% { opacity: 1; }
  50% { transform: translate(20px, -30px) scale(1.5); opacity: 0.8; }
  75% { opacity: 1; }
}
`;
document.head.appendChild(style);

