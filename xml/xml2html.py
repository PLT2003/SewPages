# xml2html.py
# -*- coding: utf-8 -*-
import xml.etree.ElementTree as ET
import html as html_escape

class Html:
    def __init__(self, archivo, titulo="InfoCircuito"):
        self.archivo = archivo
        self.titulo = titulo
        self._escribir_inicio()

    def _escribir_inicio(self):
        # Cabecera HTML básica, responsive y enlace a CSS
        self.archivo.write('<!doctype html>\n')
        self.archivo.write('<html lang="es">\n')
        self.archivo.write('<head>\n')
        self.archivo.write('  <meta charset="utf-8">\n')
        self.archivo.write(f'  <title>{html_escape.escape(self.titulo)}</title>\n')
        self.archivo.write('  <link rel="icon" href="multimedia/favicon.ico" type="image/x-icon">\n')
        self.archivo.write('  <meta name="author" content="Pablo López Tamargo" />\n')
        self.archivo.write('  <meta name="description" content="Información del circuito de MotoGP-Desktop" />\n')
        self.archivo.write('  <meta name="keywords" content="circuito, carrera, recorrido" />\n')
        self.archivo.write('  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n')
        # Enlace a la hoja de estilos del proyecto MotoGP-Desktop
        self.archivo.write('  <link rel="stylesheet" href="../estilo/estilo.css">\n')
        self.archivo.write('  <link rel="stylesheet" href="../estilo/layout.css">\n')
        # Pequeña regla para mejorar accesibilidad si no hay CSS (no obligatoria)
        self.archivo.write('</head>\n')
        self.archivo.write('<body>\n')

    def abrir_header(self, titulo):
        self.archivo.write('<header role="banner">\n')
        self.archivo.write(f'  <h1>{html_escape.escape(titulo)}</h1>\n')
        self.archivo.write('</header>\n')

    def abrir_main(self):
        self.archivo.write('<main role="main">\n')

    def cerrar_main(self):
        self.archivo.write('</main>\n')

    def escribir_parrafo(self, texto):
        self.archivo.write(f'  <p>{html_escape.escape(texto)}</p>\n')

    def escribir_lista_definicion(self, items):
        # items: list of (termino, definicion)
        self.archivo.write('<dl>\n')
        for termino, definicion in items:
            self.archivo.write(f'  <dt>{html_escape.escape(termino)}</dt>\n')
            self.archivo.write(f'  <dd>{html_escape.escape(definicion)}</dd>\n')
        self.archivo.write('</dl>\n')

    def escribir_tabla_kv(self, filas, summary="Información del circuito"):
        # filas: list of (clave, valor)
        self.archivo.write(f'<table role="table" summary="{html_escape.escape(summary)}">\n')
        self.archivo.write('  <tbody>\n')
        for k, v in filas:
            self.archivo.write(f'    <tr><th scope="row">{html_escape.escape(k)}</th><td>{html_escape.escape(v)}</td></tr>\n')
        self.archivo.write('  </tbody>\n')
        self.archivo.write('</table>\n')

    def escribir_lista_enlaces(self, enlaces):
        # enlaces: list of (href, texto)
        self.archivo.write('<ul>\n')
        for href, texto in enlaces:
            safe_href = html_escape.escape(href, quote=True)
            safe_text = html_escape.escape(texto)
            self.archivo.write(f'  <li><a href="{safe_href}" target="_blank" rel="noopener noreferrer">{safe_text}</a></li>\n')
        self.archivo.write('</ul>\n')

    def escribir_galeria_fotos(self, fotos):
        # fotos: list of (ruta, alt)
        self.archivo.write('<section aria-labelledby="fotos-title">\n')
        self.archivo.write('  <h2>Fotos</h2>\n')
        for ruta, alt in fotos:
            safe_ruta = html_escape.escape(ruta, quote=True)
            safe_alt = html_escape.escape(alt)
            self.archivo.write('    <figure role="listitem">\n')
            self.archivo.write(f'      <img src="{safe_ruta}" alt="{safe_alt}">\n')
            if alt:
                self.archivo.write(f'      <figcaption>{safe_alt}</figcaption>\n')
            self.archivo.write('    </figure>\n')
        self.archivo.write('</section>\n')

    def escribir_videos(self, videos):
        # videos: list of (ruta, alt)
        if not videos:
            return
        self.archivo.write('<section aria-labelledby="videos-title">\n')
        self.archivo.write('  <h2>Videos</h2>\n')
        for ruta, alt in videos:
            safe_ruta = html_escape.escape(ruta, quote=True)
            self.archivo.write('  <figure>\n')
            # Insertamos video con controles y accesibilidad
            self.archivo.write(f'    <video controls aria-label="{html_escape.escape(alt)}">\n')
            self.archivo.write(f'      <source src="{safe_ruta}">\n')
            self.archivo.write('      Tu navegador no soporta la etiqueta <code>video</code>.\n')
            self.archivo.write('    </video>\n')
            if alt:
                self.archivo.write(f'    <figcaption>{html_escape.escape(alt)}</figcaption>\n')
            self.archivo.write('  </figure>\n')
        self.archivo.write('</section>\n')

    def cerrar(self):
        self.archivo.write('</body>\n')
        self.archivo.write('</html>\n')

def extraer_info(xml_file):
    """
    Extrae la información requerida del XML usando XPath (con namespace).
    No extrae <Origen> ni <Tramos>.
    """
    tree = ET.parse(xml_file)
    root = tree.getroot()

    ns = {'ns': 'http://www.uniovi.es'}

    def txt(path):
        el = root.find(path, ns)
        return el.text.strip() if (el is not None and el.text is not None) else ''

    # Campos simples
    nombre = txt('ns:Nombre')
    longitud_circuito = txt('ns:LongitudCircuito')
    anchura = txt('ns:Anchura')
    fecha = txt('ns:Fecha')
    hora = txt('ns:Hora')
    vueltas = txt('ns:Vueltas')
    localidad = txt('ns:Localidad')
    pais = txt('ns:Pais')
    patrocinador = txt('ns:Patrocinador')
    vencedor = txt('ns:Vencedor')  # si existe

    # Bibliografía (enlaces)
    enlaces = []
    for enlace in root.findall('ns:Bibliografia/ns:Enlace', ns):
        href = enlace.get('href') or ''
        texto = enlace.text.strip() if enlace.text else ''
        enlaces.append((href, texto))

    # Fotos
    fotos = []
    for foto in root.findall('ns:Fotos/ns:Foto', ns):
        alt = foto.get('alt') or ''
        ruta = foto.text.strip() if foto.text else ''
        fotos.append((ruta, alt))

    # Videos
    videos = []
    for video in root.findall('ns:Videos/ns:Video', ns):
        alt = video.get('alt') or ''
        ruta = video.text.strip() if video.text else ''
        videos.append((ruta, alt))

    # Clasificados (lista)
    clasificados = []
    for c in root.findall('ns:Clasificados/ns:Clasificado', ns):
        posicion = c.get('posicion') or ''
        puntuacion = c.get('puntuacion') or ''
        nombre_clas = c.text.strip() if c.text else ''
        clasificados.append((posicion, nombre_clas, puntuacion))

    # Otros datos que quieras mostrar como key-value
    kv = [
        ("Nombre", nombre),
        ("Longitud (m)", longitud_circuito),
        ("Anchura (m)", anchura),
        ("Fecha", fecha),
        ("Hora", hora),
        ("Vueltas", vueltas),
        ("Localidad", localidad),
        ("País", pais),
        ("Patrocinador", patrocinador),
        ("Vencedor", vencedor),
    ]

    return {
        "kv": kv,
        "enlaces": enlaces,
        "fotos": fotos,
        "videos": videos,
        "clasificados": clasificados
    }

def generar_html(xml_input="circuitoEsquema.xml", html_output="InfoCircuito.html"):
    datos = extraer_info(xml_input)

    with open(html_output, "w", encoding="utf-8") as f:
        h = Html(f, titulo="Información del Circuito")
        h.abrir_header("Información del Circuito")
        h.abrir_main()

        # Tabla con los datos principales
        h.archivo.write('<section aria-labelledby="datos-title">\n')
        h.archivo.write('  <h2>Datos principales</h2>\n')
        h.escribir_tabla_kv(datos["kv"])
        h.archivo.write('</section>\n')

        # Bibliografía / enlaces
        h.archivo.write('<section aria-labelledby="biblio-title">\n')
        h.archivo.write('  <h2>Bibliografía y enlaces</h2>\n')
        if datos["enlaces"]:
            h.escribir_lista_enlaces(datos["enlaces"])
        else:
            h.escribir_parrafo("No hay enlaces disponibles.")
        h.archivo.write('</section>\n')

        # Clasificados
        h.archivo.write('<section aria-labelledby="clasificados-title">\n')
        h.archivo.write('  <h2>Clasificados</h2>\n')
        if datos["clasificados"]:
            h.archivo.write('<ul>\n')
            for pos, nombre, puntos in datos["clasificados"]:
                # presentamos posición, nombre y puntos
                safe = html_escape.escape(nombre)
                h.archivo.write(f'  <li>{pos}º — {safe} ({puntos} pts)</li>\n')
            h.archivo.write('</ul>\n')
        else:
            h.escribir_parrafo("No hay clasificados.")
        h.archivo.write('</section>\n')

        # Fotos y videos
        if datos["fotos"]:
            h.escribir_galeria_fotos(datos["fotos"])
        if datos["videos"]:
            h.escribir_videos(datos["videos"])

        h.cerrar_main()
        h.cerrar()

    print(f"Archivo {html_output} generado correctamente.")

if __name__ == "__main__":
    generar_html()