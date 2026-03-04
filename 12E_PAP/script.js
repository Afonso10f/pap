// ===== Carrossel Automático com pausa no modal =====
let indice = 0;
let slides = document.querySelectorAll(".slide");
let indicadores = document.querySelectorAll(".indicador");
let intervalo;

function mostrarSlide() {
    slides.forEach((slide, i) => {
        slide.classList.remove("ativo");
        if (indicadores[i]) {
            indicadores[i].classList.remove("ativo");
        }
    });

    if (slides[indice]) {
        slides[indice].classList.add("ativo");
        if (indicadores[indice]) {
            indicadores[indice].classList.add("ativo");
        }
    }
}

function mudarSlide(direcao) {
    indice += direcao;
    
    if (indice >= slides.length) {
        indice = 0;
    } else if (indice < 0) {
        indice = slides.length - 1;
    }
    
    mostrarSlide();
    clearInterval(intervalo);
    iniciarCarrossel();
}

function irParaSlide(n) {
    indice = n;
    mostrarSlide();
    clearInterval(intervalo);
    iniciarCarrossel();
}

function proximoSlide() {
    indice++;
    if (indice >= slides.length) {
        indice = 0;
    }
    mostrarSlide();
}

function iniciarCarrossel() {
    intervalo = setInterval(proximoSlide, 5000);
}

// ===== Modal de Pontos Turísticos =====
function mostrarDetalhes(lugar) {
    let titulo = document.getElementById("titulo");
    let descricao = document.getElementById("descricao");
    let modal = document.getElementById("modal");

    if (lugar === "praia") {
        titulo.innerText = "Praia Jalé";
        descricao.innerText = "A Praia Jalé é uma famosa praia tropical agradável e isolada, conhecida principalmente como um santuário para a desova de tartarugas marinhas, especialmente a tartaruga verde (mão branca). Este local paradisíaco oferece areias douradas, águas cristalinas e uma experiência única de contacto com a natureza.";
    } else if (lugar === "pico") {
        titulo.innerText = "Pico Cão Grande";
        descricao.innerText = "O Pico Cão Grande é um pico vulcânico em forma de agulha no Parque Natural Ôbo, em São Tomé e Príncipe, conhecido pela sua forma icónica e desafios de escalada. Originou-se da acumulação de lava solidificada e eleva-se abruptamente acima da floresta tropical, com um topo a 663 metros de altitude, é um dos maiores ícones do país.";
    } else if (lugar === "roça") {
        titulo.innerText = "Roça São João";
        descricao.innerText = "A roça, que no passado foi um local de produção colonial e exploração, hoje se destaca pela sua integração com a comunidade local, valorizando o turismo, a educação e o artesanato, oferecendo experiências gastronómicas únicas. É um testemunho vivo da história do país e da sua transformação.";
    } else if (lugar === "lagoa") {
        titulo.innerText = "Lagoa Azul";
        descricao.innerText = "É uma praia tropical paradisíaca na zona norte da ilha, conhecida pelas suas águas de um azul-turquesa deslumbrante, ideais para mergulho e snorkeling, devido à abundância de vida marinha, como peixes coloridos e corais. Um verdadeiro paraíso para os amantes do mar.";
    } else if (lugar === "boca") {
        titulo.innerText = "Boca do Inferno";
        descricao.innerText = "Um impressionante penhasco com ondas fortes e formações rochosas únicas, muito visitado por turistas. A história da Boca do Inferno em São Tomé está ligada a uma lenda do Barão de Água Izé, o antigo proprietário da roça, que dizia viajar de cavalo de São Tomé a Portugal, desaparecendo por uma gruta na Boca do Inferno para reaparecer em Cascais.";
    }

    modal.style.display = "block";
    clearInterval(intervalo);
}

function fecharModal() {
    let modal = document.getElementById("modal");
    modal.style.display = "none";
    iniciarCarrossel();
}

// ===== Modal de Hotéis =====
function mostrarHotelDetalhes(hotel) {
    let titulo = document.getElementById("hotelTitulo");
    let descricao = document.getElementById("hotelDescricao");
    let imagem = document.getElementById("hotelImagem");
    let modal = document.getElementById("modalHotel");

    if(hotel === "omali") {
        titulo.innerText = "Omali São Tomé";
        descricao.innerText = "Localizado na Zona Norte de São Tomé, o Omali oferece quartos confortáveis com vista para o mar, piscina infinity, restaurante gourmet e serviços de transfer. É considerado um dos melhores hotéis do país, oferecendo uma experiência premium com atendimento personalizado e instalações de primeira classe.";
        imagem.src = "imagens/omali.jpg";
        imagem.alt = "Omali São Tomé";
    } else if(hotel === "pestana") {
        titulo.innerText = "Pestana São Tomé";
        descricao.innerText = "Situado na Zona Sul, o Pestana é um hotel de 5 estrelas com piscina sobre o mar, restaurante internacional, ginásio equipado e spa relaxante. Oferece uma experiência luxuosa com vistas deslumbrantes do oceano Atlântico e acesso direto à praia.";
        imagem.src = "imagens/pestana.jpg";
        imagem.alt = "Pestana São Tomé";
    } else if(hotel === "hotelpraia") {
        titulo.innerText = "Hotel Praia";
        descricao.innerText = "Localizado na Zona Oeste, o Hotel Praia oferece piscina, restaurante com comida local e internacional, e Wi-Fi gratuito. Ideal para quem deseja estar perto da praia com um excelente custo-benefício. Ambiente familiar e acolhedor.";
        imagem.src = "imagens/hotelpraia.jpg";
        imagem.alt = "Hotel Praia";
    } else if(hotel === "roca") {
        titulo.innerText = "Roça São João dos Angolares";
        descricao.innerText = "Uma antiga plantação colonial transformada em centro cultural e turístico, oferecendo uma experiência autêntica e única. Perfeito para quem busca imersão cultural, com atividades tradicionais, gastronomia local e contacto direto com a comunidade.";
        imagem.src = "imagens/roça.jpg";
        imagem.alt = "Roça São João";
    } else if(hotel === "clubSantana") {
        titulo.innerText = "Club Santana Beach & Resort";
        descricao.innerText = "Localizado em Santana, oferece piscina, restaurante à beira-mar, praia privada e diversas atividades aquáticas como mergulho, canoagem e passeios de barco. Um resort completo para quem busca relaxamento e aventura em igual medida.";
        imagem.src = "imagens/clubsantana.jpg";
        imagem.alt = "Club Santana";
    }

    modal.style.display = "block";
}

function fecharModalHotel() {
    document.getElementById("modalHotel").style.display = "none";
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    let modal = document.getElementById("modal");
    let modalHotel = document.getElementById("modalHotel");
    
    if (event.target == modal) {
        fecharModal();
    }
    if (event.target == modalHotel) {
        fecharModalHotel();
    }
}

// ===== Botão Voltar ao Topo =====
function voltarAoTopo() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Mostrar/ocultar botão ao rolar
window.onscroll = function() {
    let botao = document.getElementById("voltarTopo");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        botao.classList.add("show");
    } else {
        botao.classList.remove("show");
    }
};

// ===== Scroll suave para links de navegação =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Animação de entrada dos elementos =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', function() {
    const elementos = document.querySelectorAll('.hotel-card, .fact, .historia-text');
    elementos.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Inicia o carrossel ao carregar a página
window.addEventListener('DOMContentLoaded', function() {
    if (slides.length > 0) {
        mostrarSlide();
        iniciarCarrossel();
    }
});