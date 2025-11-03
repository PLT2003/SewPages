class Cronometro {
    constructor() {
        this.tiempo = 0;
        this.stop = false;
        this.corriendo = null; // Atributo para almacenar el temporizador
    }

    arrancar() {
        this.stop = false;
        try {
            this.inicio = Temporal.Now.instant();
        } catch (error) {
            this.inicio = new Date();
        }
        if (!this.stop) {
            this.corriendo = window.setInterval(this.actualizar.bind(this), 100);
        }
    }

    actualizar() {
        try {
            this.tiempo = Temporal.Duration.from(this.inicio.until(Temporal.Now.instant())).total('millisecond');
        } catch (error) {
            const ahora = new Date();
            this.tiempo = ahora - this.inicio;
        }
    }

    mostrar() {
        let minutos = parseInt(this.tiempo / 60000).toString().padStart(2, '0');
        let segundos = parseInt((this.tiempo % 60000) / 1000).toString().padStart(2, '0');
        let decimas = parseInt(((this.tiempo % 60000) % 1000) / 10);
        const cadena = `${minutos}:${segundos}:${decimas}`;
        const main = document.querySelector('main');
        if (main) {
            const primerParrafo = main.querySelector('p');
            if (primerParrafo) {
                primerParrafo.textContent = cadena;
            } else {
                console.error("No se encontró un párrafo dentro del elemento <main>.");
            }
        } else {
            console.error("No se encontró el elemento <main> en el documento.");
        }
    }

    parar() {
        this.stop = true;
        if (this.corriendo) {
            clearInterval(this.corriendo);
        }
    }

    reiniciar() {
        if (this.corriendo) {
            clearInterval(this.corriendo);
        }
        this.tiempo = 0;
        this.mostrar();
    }
}