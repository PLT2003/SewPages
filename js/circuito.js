class Circuito {
    constructor() {
        this.comprobarApiFile();
    }

    comprobarApiFile() {
        const mensaje = document.createElement("p");
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            return;
        } else {
            mensaje.textContent = "¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!"
        }
        document.body.appendChild(mensaje);
    }

    leerArchivoHTML(files) {
        const archivo = files[0];

        const tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) {
            const lector = new FileReader();

            lector.onload = (evento) => {
                this.mostrarInformacion(lector.result);
            };

            lector.readAsText(archivo);
        }
    }

    mostrarInformacion(textoHTML) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(textoHTML, "text/html");

        const mainDoc = doc.querySelector("main");

        const mainCircuito = document.querySelector("main");
        mainCircuito.innerHTML += mainDoc.innerHTML;

        document.body.appendChild(mainCircuito);

        this.cambiarAtributos();
    }

    cambiarAtributos() {
        $("img").each(function () {
            const srcActual = $(this).attr("src");
            if (srcActual && srcActual.startsWith(".")) {
                $(this).attr("src", srcActual.slice(1));
            }
        });

        $("video source").each(function () {
            const srcActual = $(this).attr("src");
            if (srcActual && srcActual.startsWith(".")) {
                $(this).attr("src", srcActual.slice(1));
            }
        });
    }
}

const circuito = new Circuito();

class CargadorSVG {
    constructor() {

    }

    leerArchivoSVG(files) {
        const archivo = files[0];

        if (archivo && archivo.name.endsWith(".svg")) {
            const lector = new FileReader();

            lector.onload = (evento) => {
                this.insertarSVG(lector.result);
            };

            lector.readAsText(archivo);
        }
    }

    insertarSVG(svgTexto) {
        const contenedor = document.querySelector("main");
        contenedor.innerHTML += svgTexto;
    }
}

const cargadorSVG = new CargadorSVG();