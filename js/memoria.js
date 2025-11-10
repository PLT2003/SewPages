class Memoria {
    constructor() {
        this.tablero_bloqueado = true;
        this.primera_carta = null;
        this.segunda_carta = null;
        this.barajarCartas();
    }

    voltearCarta(carta) {
        if (
            this.tablero_bloqueado || 
            carta.getAttribute('data-estado') === 'volteada' || 
            carta.getAttribute('data-estado') === 'revelada'
        ) {
            return;
        }

        carta.setAttribute('data-estado', 'volteada');

        if (!this.primera_carta) {
            this.primera_carta = carta;
            return;
        }

        this.segunda_carta = carta;
        this.tablero_bloqueado = true;
        this.comprobarPareja();
    }

    barajarCartas() {
        const main = document.querySelector("main");
        const cartas = Array.from(main.children);

        for (let i = cartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            main.appendChild(cartas[j]);
        }
    }

    reinciarAtributos() {
        this.tablero_bloqueado = false;
        this.primera_carta = null;
        this.segunda_carta = null;
    }

    deshabilitarCartas() {
        this.primera_carta.setAttribute('data-estado', 'revelada');
        this.segunda_carta.setAttribute('data-estado', 'revelada');
        this.comprobarJuego
        this.reiniciarAtributos();
    }

    comprobarJuego() {
        const main = document.querySelector("main");
        const cartasReveladas = main.querySelectorAll('article[data-estado="revelada"]');

        if (cartasReveladas.length === main.children.length - 1) {
            this.tablero_bloqueado = true;
        }
    }

    cubrirCartas() {
        this.tablero_bloqueado = true;

        setTimeout(() => {
            if (this.primera_carta) this.primera_carta.removeAttribute("data-estado");
            if (this.segunda_carta) this.segunda_carta.removeAttribute("data-estado");

            this.reiniciarAtributos();
        }, 1500);
    }

    comprobarPareja() {
        const img1 = this.primera_carta.children[1].getAttribute("src");
        const img2 = this.segunda_carta.children[1].getAttribute("src");
    
        (img1 === img2) ? this.deshabilitarCartas() : this.cubrirCartas();
    }
    
}

const memoria = new Memoria();