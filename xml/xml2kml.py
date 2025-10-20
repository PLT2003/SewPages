# -*- coding: utf-8 -*-
# Generador de archivo KML a partir de circuitoEsquema.xml usando árbol DOM y expresiones XPath
# Autor: Adaptado según requerimientos

from xml.dom import minidom

def extraer_coordenadas(dom):
    """Extrae las coordenadas del circuito usando el árbol DOM y expresiones XPath manuales"""
    coordenadas = []

    # Origen
    origen = dom.getElementsByTagName("Origen")[0]
    lon = origen.getElementsByTagName("Longitud")[0].firstChild.nodeValue.strip()
    lat = origen.getElementsByTagName("Latitud")[0].firstChild.nodeValue.strip()
    alt = origen.getElementsByTagName("Altitud")[0].firstChild.nodeValue.strip()
    coordenadas.append((lon, lat, alt))

    # Tramos
    tramos = dom.getElementsByTagName("Tramo")
    for tramo in tramos:
        final = tramo.getElementsByTagName("Final")[0]
        lon = final.getElementsByTagName("Longitud")[0].firstChild.nodeValue.strip()
        lat = final.getElementsByTagName("Latitud")[0].firstChild.nodeValue.strip()
        alt = final.getElementsByTagName("Altitud")[0].firstChild.nodeValue.strip()
        coordenadas.append((lon, lat, alt))

    return coordenadas

def escribir_prologo_kml(archivo):
    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
    archivo.write("  <Document>\n")
    archivo.write("    <Placemark>\n")
    archivo.write("      <name>Circuito</name>\n")
    archivo.write("      <LineString>\n")
    archivo.write("        <extrude>1</extrude>\n")
    archivo.write("        <tessellate>1</tessellate>\n")
    archivo.write("        <coordinates>\n")

def escribir_epilogo_kml(archivo):
    archivo.write("        </coordinates>\n")
    archivo.write("        <altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("      </LineString>\n")
    archivo.write("      <Style id='lineaRoja'>\n")
    archivo.write("        <LineStyle>\n")
    archivo.write("          <color>#ff0000ff</color>\n")
    archivo.write("          <width>5</width>\n")
    archivo.write("        </LineStyle>\n")
    archivo.write("      </Style>\n")
    archivo.write("    </Placemark>\n")
    archivo.write("  </Document>\n")
    archivo.write("</kml>\n")

def main():
    # 1. Leer archivo XML y generar árbol DOM
    try:
        dom = minidom.parse("circuitoEsquema.xml")
    except FileNotFoundError:
        print("No se encontró el archivo circuitoEsquema.xml")
        return

    # 2. Extraer coordenadas usando DOM + XPath manual
    coordenadas = extraer_coordenadas(dom)

    # 3. Escribir archivo KML
    try:
        with open("circuito.kml", "w", encoding="utf-8") as salida:
            escribir_prologo_kml(salida)
            for lon, lat, alt in coordenadas:
                salida.write(f"          {lon},{lat},{alt}\n")
            escribir_epilogo_kml(salida)
        print("Archivo circuito.kml generado correctamente.")
    except IOError:
        print("No se pudo crear el archivo circuito.kml")

if __name__ == "__main__":
    main()
