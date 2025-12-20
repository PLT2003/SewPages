class Circuito {
    constructor() {
        this.comprobarApiFile();
    }

    comprobarApiFile() {
        const mensaje = document.createElement("p");
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            return;
        } else {
            mensaje.textContent =
                "¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!";
            document.body.appendChild(mensaje);
        }
    }

    leerArchivoHTML(files) {
        const archivo = files[0];
        const tipoTexto = /text.*/;

        if (archivo.type.match(tipoTexto)) {
            const lector = new FileReader();
            lector.onload = () => {
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

// =======================================================
// CARGADOR SVG
// =======================================================
class CargadorSVG {
    leerArchivoSVG(files) {
        const archivo = files[0];

        if (archivo && archivo.name.endsWith(".svg")) {
            const lector = new FileReader();
            lector.onload = () => {
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

// =======================================================
// MAPA DINÁMICO (SIN ID)
// =======================================================

// Crear dinámicamente el div del mapa
const divMapa = document.createElement("div");
document.body.appendChild(divMapa);

// Crear mapa Mapbox usando el div directamente
mapboxgl.accessToken = "pk.eyJ1IjoicGFiYXNhbyIsImEiOiJjbWpiYmp1dGQwZmptM2VzZG9laG5wcGg2In0.GxPq7IWgDSZVBVy-x2qvrg";

const mapa = new mapboxgl.Map({
    container: divMapa,
    style: "mapbox://styles/mapbox/streets-v12",
    center: [103.0842, 14.9586],
    zoom: 14
});

// =======================================================
// CARGADOR KML
// =======================================================
class CargadorKML {
    constructor(mapa) {
        this.mapa = mapa;
        this.puntoOrigen = null;
        this.tramos = [];
    }

    // ======================
    // TAREA 4 – Lectura KML
    // ======================
    leerArchivoKML(files) {
        const archivo = files[0];

        if (!archivo || !archivo.name.endsWith(".kml")) {
            return;
        }

        const lector = new FileReader();
        lector.onload = () => {
            this.procesarKML(lector.result);
        };
        lector.readAsText(archivo);
    }

    procesarKML(textoKML) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(textoKML, "text/xml");

        const nodoCoordenadas = xml.getElementsByTagName("coordinates")[0];
        const textoCoordenadas = nodoCoordenadas.textContent.trim();

        const lineas = textoCoordenadas.split(/\s+/);
        this.tramos = [];

        lineas.forEach(linea => {
            const datos = linea.split(",");
            this.tramos.push([
                parseFloat(datos[0]),
                parseFloat(datos[1])
            ]);
        });

        if (this.tramos.length > 0) {
            this.puntoOrigen = this.tramos[0];
        }

        this.insertarCapaKML();
    }

    // ======================
    // TAREA 5 – Mapa dinámico
    // ======================
    insertarCapaKML() {
        new mapboxgl.Marker()
            .setLngLat(this.puntoOrigen)
            .addTo(this.mapa);

        this.mapa.setCenter(this.puntoOrigen);
        this.mapa.setZoom(15);

        if (this.mapa.getSource("circuito")) {
            this.mapa.removeLayer("trazado");
            this.mapa.removeSource("circuito");
        }

        this.mapa.addSource("circuito", {
            type: "geojson",
            data: {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: this.tramos
                }
            }
        });

        this.mapa.addLayer({
            id: "trazado",
            type: "line",
            source: "circuito",
            paint: {
                "line-color": "#ff0000",
                "line-width": 5
            }
        });
    }
}

// Crear el cargador KML
const cargadorKML = new CargadorKML(mapa);
