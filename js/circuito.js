class Circuito {
    constructor() {
        this.comprobarApiFile();
    }

    comprobarApiFile() {
        const mensaje = document.createElement("p"); 
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            mensaje.textContent = "Este navegador soporta el API File"
        } else {
            mensaje.textContent = "¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!"
        }
        document.body.appendChild(mensaje);
    }

    leerArchivoHTML(files) {
        var archivo = files[0];
        var tipoTexto = /text.*/;
    }
}