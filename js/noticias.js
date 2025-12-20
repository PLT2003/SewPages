class Noticias {
    constructor() {
        this.busqueda = "ChangInternationalCircuit";
        this.url = "https://api.thenewsapi.com/v1/news/top";
        this.apiKey = "ZItaq4Oij7VdxbWAUGo9kt7FH2WwYuvzlGFY2jP5";
    }

    buscar() {
        const endpoint = `${this.url}?api_token=${this.apiKey}&search=${this.busqueda}`;

        fetch(endpoint)
            .then(respuesta => respuesta.json())
            .then(datos => {
                let listaProcesada = this.procesarInformacion(datos);
                this.mostrarNoticias(listaProcesada);
            })
            .catch(error => {
                console.error("Error al obtener noticias:", error);
            });
    }

    procesarInformacion(json) {
    let listaProcesada = [];

    let noticias = json.data;

    for (let noticia of noticias) {
        let objeto = {
            titular: noticia.title,
            entradilla: noticia.description,
            enlace: noticia.url,
            fuente: noticia.source
        };

        listaProcesada.push(objeto);
    }

    return listaProcesada;
}

    mostrarNoticias(listaProcesada) {
    // Crear sección y H2 dinámicamente
    const section = $("<section></section>");
    const h2 = $("<h2></h2>").text("Noticias del circuito de Chang International Circuit");
    section.append(h2);
    $("body").append(section); // agregamos la sección al body

    for (let noticia of listaProcesada) {
        let articulo = $("<article></article>").addClass("noticia");

        let titulo = $("<h3></h3>").text(noticia.titular);
        let entradilla = $("<p></p>").text(noticia.entradilla);
        let enlace = $("<a></a>")
            .attr("href", noticia.enlace)
            .attr("target", "_blank")
            .text("Leer noticia completa");
        let fuente = $("<p></p>")
            .addClass("fuente")
            .text("Fuente: " + noticia.fuente);

        articulo.append(titulo, entradilla, enlace, fuente);
        section.append(articulo);
    }
}

}