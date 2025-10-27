class Ciudad {
    constructor(nombre, pais, gentilicio) {
        this.nombre = nombre;
        this.pais = pais;
        this.gentilicio = gentilicio;
        this.poblacion = null;
        this.centro = null;
    }

    rellenar(poblacion, centro) {
        this.poblacion = poblacion;
        this.centro = centro;
    }

    getNombre() {
        const mensaje = document.createElement("p");
        mensaje.textContent = this.nombre;
        document.body.appendChild(mensaje);
    }

    getPais() {
        const mensaje = document.createElement("p");
        mensaje.textContent = this.pais;
        document.body.appendChild(mensaje);
    }

    getInfo() {
        const mensaje = document.createElement("ul");
    
        const item1 = document.createElement("li");
        item1.textContent = this.gentilicio;
        mensaje.appendChild(item1);
    
        const item2 = document.createElement("li");
        item2.textContent = this.poblacion;
        mensaje.appendChild(item2);
    
        document.body.appendChild(mensaje);
    }
    

    getCentro() {
        const mensaje = document.createElement("p");
        mensaje.textContent = this.centro;
        document.body.appendChild(mensaje);
    }
}