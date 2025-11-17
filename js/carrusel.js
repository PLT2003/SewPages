class Carrusel {
    constructor() {
        this.busqueda = "Chang International Circuit";
        this.actual = 0;
        this.maximo = 4; // Para 5 fotos: índices 0..4
    }

    getFotografias() {
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

                    resolve({
                        cantidad: fotos.length,
                        imagenes: fotos
                    });
                },
                error: reject
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
            procesado.fotos.push({
                indice: i,
                titulo: seleccion[i].title,
                url: seleccion[i].url,
                autor: seleccion[i].autor
            });
        }
        return procesado;
    }

    mostrarFotografias(jsonProcesado) {

        const article = $("article");

        let primeraFoto = jsonProcesado.fotos[0];

        let imagen = $("<img>")
            .attr("src", primeraFoto.url)
            .attr("alt", primeraFoto.titulo);

        article.append(imagen);

        // 🔥 activar temporizador usando bind()
        setInterval(this.cambiarFotografia.bind(this, jsonProcesado), 3000);
    }

    cambiarFotografia(jsonProcesado) {
        this.actual++;

        if (this.actual > this.maximo) {
            this.actual = 0;
        }

        let foto = jsonProcesado.fotos[this.actual];

        $("article img")
            .attr("src", foto.url)
            .attr("alt", foto.titulo);
    }
}
