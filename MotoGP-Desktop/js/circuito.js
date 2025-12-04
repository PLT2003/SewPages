class Circuito {
    constructor() {
        this.comprobarApiFile();
        this.leerArchivoHTML();
    }

    comprobarApiFile() {
        const mensaje = document.createElement("p");
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            this.leerArchivoHTML();
            return;
        } else {
            mensaje.textContent = "¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!"
        }
        document.body.appendChild(mensaje);
    }

    leerArchivoHTML() {
        const ruta = "./xml/infoCircuito.html";
        let contenido;

        fetch(ruta)
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se pudo cargar el archivo HTML");
                }
                return response.text();
            })
            .then(texto => {
                contenido = texto;
                this.mostrarInformacion(contenido);
            })
            .catch(error => {
                console.error("Error:", error);
                errorArchivo.innerText = "Error : ¡¡¡ No se pudo leer infoCircuito.html !!!";
            });
    }

    mostrarInformacion(textoHTML) {
        var mainCircuito = document.createElement("main");

        const parser = new DOMParser();
        const doc = parser.parseFromString(textoHTML, "text/html");

        const mainDoc = doc.querySelector("main");
        mainCircuito.textContent = mainDoc;

        document.body.appendChild(mainDoc);
        this.cambiarAtributos();
    }

    cambiarAtributos() {
        $("img").each(function () {
            const srcActual = $(this).attr("src");
            $(this).attr("src", srcActual.slice(1));
        });

        // Cambiar rutas de videos
        $("video source").each(function () {
            const srcActual = $(this).attr("src");
            $(this).attr("src", srcActual.slice(1));
        });
    }

}