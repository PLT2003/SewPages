# xml2altimetrial.py
# -*- coding: utf-8 -*-
import xml.etree.ElementTree as ET

class Svg:
    def __init__(self, archivo, ancho, alto):
        self.archivo = archivo
        self.ancho = ancho
        self.alto = alto
        archivo.write('<?xml version="1.0" encoding="UTF-8" ?>\n')
        archivo.write(f'<svg xmlns="http://www.w3.org/2000/svg" width="{ancho}" height="{alto}" version="1.1">\n')

    def escribe_estilos(self):
        self.archivo.write('<style>\n')
        self.archivo.write('  polyline { fill:lightblue; stroke:blue; stroke-width:2; }\n')
        self.archivo.write('  line { stroke:gray; stroke-width:1; stroke-dasharray:4; }\n')
        self.archivo.write('  text { font-size:12px; fill:black; }\n')
        self.archivo.write('</style>\n')

    def dibuja_linea_horizontal(self, y):
        self.archivo.write(f'<line x1="0" y1="{y}" x2="{self.ancho}" y2="{y}" />\n')

    def dibuja_texto(self, x, y, texto):
        self.archivo.write(f'<text x="{x}" y="{y}" >{texto}</text>\n')

    def dibuja_polilinea(self, puntos):
        puntos_str = " ".join(f"{x},{y}" for x, y in puntos)
        self.archivo.write(f'<polyline points="{puntos_str}" />\n')

    def final(self):
        self.archivo.write('</svg>\n')

def extraer_puntos(xml_file):
    """Extrae distancias acumuladas y altitudes usando XPath con namespace"""
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Definir el namespace
    ns = {'ns': 'http://www.uniovi.es'}

    puntos = []

    # Altura inicial del Origen
    altitud_origen_elem = root.find("ns:Origen/ns:Altitud", ns)
    if altitud_origen_elem is None:
        raise ValueError("No se encontró el elemento <Altitud> dentro de <Origen> en el XML.")
    altitud_origen = float(altitud_origen_elem.text)
    puntos.append((0.0, altitud_origen))  # distancia acumulada = 0

    # Tramos
    distancia_acumulada = 0.0

    for tramo in root.findall("ns:Tramos/ns:Tramo", ns):
        distancia = float(tramo.find("ns:Distancia", ns).text)
        altitud_elem = tramo.find("ns:Final/ns:Altitud", ns)
        if altitud_elem is None:
            continue  # por si algún tramo no tiene altitud final
        altitud = float(altitud_elem.text)
        distancia_acumulada += distancia
        puntos.append((distancia_acumulada, altitud))

    return puntos

def escalar_puntos(puntos, ancho, alto, margen=50):
    """Escala los puntos a coordenadas SVG (invirtiendo eje Y) y cierra el perfil"""
    distancias = [x for x, y in puntos]
    altitudes = [y for x, y in puntos]

    min_x = 0
    max_x = max(distancias)
    min_y = min(altitudes)
    max_y = max(altitudes)

    escala_x = (ancho - 2*margen) / (max_x - min_x)
    escala_y = (alto - 2*margen) / (max_y - min_y)

    puntos_svg = []
    for x, y in puntos:
        svg_x = margen + (x - min_x) * escala_x
        svg_y = alto - margen - (y - min_y) * escala_y  # eje Y invertido en SVG
        puntos_svg.append((svg_x, svg_y))

    # Añadir puntos para cerrar el perfil (suelo)
    suelo_y = alto - margen
    x_final = puntos_svg[-1][0]
    x_inicial = puntos_svg[0][0]

    puntos_svg.append((x_final, suelo_y))   # bajar verticalmente al suelo
    puntos_svg.append((x_inicial, suelo_y)) # cerrar por la izquierda
    puntos_svg.append(puntos_svg[0])        # volver al inicio (opcional, cierra del todo)

    return puntos_svg

def main():
    input_file = "circuitoEsquema.xml"
    output_file = "altimetria.svg"
    ancho = 800
    alto = 400

    try:
        puntos = extraer_puntos(input_file)
    except FileNotFoundError:
        print(f"No se encontró el archivo {input_file}")
        return

    puntos_svg = escalar_puntos(puntos, ancho, alto)

    try:
        with open(output_file, "w", encoding="utf-8") as archivo:
            svg = Svg(archivo, ancho, alto)
            svg.escribe_estilos()
            # Dibujar líneas de escala
            for i in range(5):
                y = alto - 50 - i * ((alto - 100) / 4)
                svg.dibuja_linea_horizontal(y)
                svg.dibuja_texto(10, y - 5, f"{round(min(y for x, y in puntos) + i * (max(y for x, y in puntos) - min(y for x, y in puntos)) / 4, 1)} m")

            svg.dibuja_polilinea(puntos_svg)
            svg.final()

        print(f"Archivo {output_file} generado correctamente.")
    except IOError:
        print(f"No se pudo escribir el archivo {output_file}")

if __name__ == "__main__":
    main()
