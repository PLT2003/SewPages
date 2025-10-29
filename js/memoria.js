class Memoria {
    constructor() {}

    voltearCarta(carta) {
        carta.setAttribute('data-estado', 'volteada');
    }
}

const memoria = new Memoria();