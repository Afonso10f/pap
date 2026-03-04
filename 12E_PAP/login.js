// ===== Função de Mergulho =====
function iniciarMergulho() {
    // Prevenir envio do formulário
    event.preventDefault();
    
    // Pegar valores do formulário (opcional - pode validar aqui)
    const username = document.getElementById('username')?.value;
    const password = document.getElementById('password')?.value;
    
    // Mostrar efeito de mergulho
    const diveEffect = document.getElementById('diveEffect');
    const loginPage = document.getElementById('loginPage');
    
    // Adicionar classe active para iniciar animação
    diveEffect.classList.add('active');
    
    // Adicionar som de água (opcional - comentado pois precisa de arquivo de áudio)
    // const splashSound = new Audio('sounds/splash.mp3');
    // splashSound.play();
    
    // Animar saída da página de login
    loginPage.style.animation = 'fadeOut 0.8s ease-out forwards';
    
    // Após 2.5 segundos, redirecionar para a página principal
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2500);
}

// ===== Animação de Fade Out =====
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(style);

// ===== Efeitos de Partículas Flutuantes =====
function criarParticulas() {
    const loginPage = document.querySelector('.login-page');
    const numParticulas = 20;
    
    for (let i = 0; i < numParticulas; i++) {
        const particula = document.createElement('div');
        particula.className = 'particula-flutuante';
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
        `;
        loginPage.appendChild(particula);
    }
}

// Adicionar animação de partículas
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float-particle {
        0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
        }
        25% {
            opacity: 1;
        }
        50% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.5);
            opacity: 0.8;
        }
        75% {
            opacity: 1;
        }
    }
`;
document.head.appendChild(particleStyle);

// ===== Validação do Formulário =====
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formLogin');
    const inputs = form.querySelectorAll('input');
    
    // Criar partículas de fundo
    criarParticulas();
    
    // Adicionar efeito de foco nos inputs
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'all 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
    
    // Permitir Enter para submeter
    form.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            iniciarMergulho();
        }
    });
});

// ===== Efeito de Ripple nos Botões =====
function criarRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
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
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Adicionar animação de ripple
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-effect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Adicionar ripple aos botões
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-login, .btn-guest');
    buttons.forEach(button => {
        button.addEventListener('click', criarRipple);
    });
});

// ===== Efeito de Parallax no Mouse =====
document.addEventListener('mousemove', function(e) {
    const loginContainer = document.querySelector('.login-container');
    if (!loginContainer) return;
    
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    loginContainer.style.transform = `translate(${x}px, ${y}px)`;
    loginContainer.style.transition = 'transform 0.3s ease-out';
});

// ===== Mensagens de Boas-Vindas Aleatórias =====
const mensagens = [
    "Mergulhando no Paraíso...",
    "Preparando sua Aventura...",
    "Navegando para São Tomé...",
    "Descobrindo as Ilhas...",
    "Iniciando sua Jornada..."
];

function mostrarMensagemAleatoria() {
    const diveText = document.querySelector('.dive-text h2');
    if (diveText) {
        const mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
        diveText.textContent = mensagemAleatoria;
    }
}

// ===== Prevenção de Múltiplos Cliques =====
let mergulhoIniciado = false;

function iniciarMergulho() {
    if (mergulhoIniciado) return;
    mergulhoIniciado = true;
    
    event.preventDefault();
    
    // Mostrar mensagem aleatória
    mostrarMensagemAleatoria();
    
    const diveEffect = document.getElementById('diveEffect');
    const loginPage = document.getElementById('loginPage');
    
    // Adicionar efeito de rotação 3D na página de login
    loginPage.style.animation = 'fadeOutRotate 1s ease-out forwards';
    
    // Ativar efeito de mergulho com túnel 3D
    diveEffect.classList.add('active');
    
    // Adicionar efeito de zoom na câmera
    setTimeout(() => {
        diveEffect.style.animation = 'cameraZoom 1.5s ease-in-out forwards';
    }, 500);
    
    // Vibração (se suportado)
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }
    
    // Criar mais partículas dinâmicas
    criarParticulasDinamicas();
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2500);
}

// ===== Criar Partículas Dinâmicas no Túnel =====
function criarParticulasDinamicas() {
    const particlesContainer = document.querySelector('.particles-3d');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-3d-dynamic';
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

// ===== Easter Egg - Duplo Clique no Logo =====
let clickCount = 0;
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.logo-circle');
    if (logo) {
        logo.addEventListener('click', function() {
            clickCount++;
            if (clickCount === 3) {
                this.style.animation = 'spin 1s ease-in-out';
                setTimeout(() => {
                    this.style.animation = 'float 3s ease-in-out infinite';
                }, 1000);
                clickCount = 0;
            }
        });
    }
});

// Adicionar animação de spin
const spinStyle = document.createElement('style');
spinStyle.textContent = `
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(spinStyle);

// ===== Mensagem de Console =====
console.log('%c🏝️ Bem-vindo ao Site de Turismo de São Tomé e Príncipe! 🌴', 
    'font-size: 20px; color: #006633; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%cDesenvolvido com ❤️ para promover o turismo no arquipélago', 
    'font-size: 14px; color: #FFD700;');