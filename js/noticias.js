class Noticias {
    constructor() {
        this.busqueda = "ChangInternationalCircuit";
        this.url = "https://api.thenewsapi.com/v1/news/top";
        this.apiKey = "b6dfd3cc39a44306b6f61f68656845fc";
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
    }

    mostrarNoticias(listaProcesada) {
        seccion = $("section").last();

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

            articulo.append(titulo);
            articulo.append(entradilla);
            articulo.append(enlace);
            articulo.append(fuente);

            seccion.append(articulo);
        }
    }
}