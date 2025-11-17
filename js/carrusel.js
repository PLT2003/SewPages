class Carrusel {
    constructor() {
        this.busqueda = "Chang International Circuit";
        this.actual = 0;
        this.maximo = 4;
    }
    getFotografias() {

        // Devolvemos una promesa con el JSON final
        return new Promise((resolve, reject) => {

            $.ajax({
                url: "https://www.flickr.com/services/feeds/photos_public.gne",
                type: "GET",
                dataType: "jsonp",
                jsonpCallback: "jsonFlickrFeed",
                data: {
                    format: "json",
                    tags: this.busqueda
                },

                success: function (data) {

                    let fotos = data.items.map(item => {

                        let url = item.media.m;

                        url = url.replace("_m.jpg", "_z.jpg");

                        return {
                            title: item.title,
                            url: url,
                            autor: item.author
                        };
                    });

                    let resultado = {
                        cantidad: fotos.length,
                        imagenes: fotos
                    };

                    resolve(resultado);
                },

                error: function (err) {
                    reject(err);
                }
            });

        });
    }

    procesarJSONFotografias(json) {

        let seleccion = json.imagenes.slice(0, 5);

        let procesado = {
            total: seleccion.length,
            fotos: []
        };

        for (let i = 0; i < seleccion.length; i++) {
            let foto = {
                indice: i,
                titulo: seleccion[i].title,
                url: seleccion[i].url,
                autor: seleccion[i].autor
            };

            procesado.fotos.push(foto);
        }

        return procesado;
    }

    mostrarFotografias(jsonProcesado) {

        const article = document.querySelector("article");

        let primeraFoto = jsonProcesado.fotos[0];

        let imagen = $("<img>")
            .attr("src", primeraFoto.url)
            .attr("alt", primeraFoto.titulo);

        article.appendChild(imagen);
    }

    cambiarFotografia(jsonProcesado) {

    this.actual++;

    if (this.actual >= this.maximo) {
        this.actual = 0;
    }

    let foto = jsonProcesado.fotos[this.actual];

    $("#zonaImagenes article img")
        .attr("src", foto.url)
        .attr("alt", foto.titulo);
}

}