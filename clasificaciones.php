<?php
class Clasificacion {
    private $documento;
    private $xml;

    public function __construct() {
        $this->documento = "xml/circuitoEsquema.xml";
    }

    public function consultar() {
        $this->xml = simplexml_load_file($this->documento);
        $this->xml->registerXPathNamespace("c", "http://www.uniovi.es");
    }

    private function formatearDuracion($duracion) {
    // Extraer minutos y segundos usando regex
    preg_match('/PT(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/', $duracion, $matches);

    $minutos = isset($matches[1]) ? $matches[1] : 0;
    $segundos = isset($matches[2]) ? $matches[2] : 0;

    // Formato mm:ss.s
    return sprintf("%02d:%06.3f", $minutos, $segundos);
}

    public function getGanador() {
    $g = $this->xml->xpath("//c:Vencedor")[0];
    $duracionRaw = (string)$g["duracion"];
    return [
        "nombre" => (string)$g,
        "duracion" => $this->formatearDuracion($duracionRaw)
    ];
}


    public function getClasificacion() {
        return $this->xml->xpath("//c:Clasificado");
    }
}

$clasificacion = new Clasificacion();
$clasificacion->consultar();

$ganador = $clasificacion->getGanador();
$clasificados = $clasificacion->getClasificacion();
?>

<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Clasificaciones</title>

    <link rel="icon" href="multimedia/favicon.ico" type="image/x-icon">

    <meta name="author" content="Pablo López Tamargo" />
    <meta name="description" content="Clasificaciones de las carreras de MotoGP-Desktop" />
    <meta name="keywords" content="clasificación, lugar, puesto, puntuación, ganador, perdedor" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
</head>

<body>
<header>
    <h1>
        <a href="index.html" title="Página inicial de MotoGP-Desktop">
            MotoGP-Desktop
        </a>
    </h1>
    <nav>
        <a href="index.html">Inicio</a>
        <a href="piloto.html">Piloto</a>
        <a href="circuito.html">Circuito</a>
        <a href="meteorologia.html">Meteorología</a>
        <a href="clasificaciones.php" class="active">Clasificaciones</a>
        <a href="juegos.html">Juegos</a>
        <a href="ayuda.html">Ayuda</a>
    </nav>
</header>

<p>
    Estás en:
    <a href="index.html">Inicio</a>
    >>
    <strong>Clasificaciones</strong>
</p>

<main>
    <h2>Clasificaciones de MotoGP-Desktop</h2>

    <section>
        <h3>Ganador de la carrera en Chang International Circuit</h3>
        <p>
            <?php echo $ganador["nombre"]; ?>
            – Tiempo:
            <?php echo $ganador["duracion"]; ?>
        </p>
    </section>

    <section>
        <h3>Clasificación tras la carrera en Chang International Circuit</h3>
        <ul>
            <?php foreach ($clasificados as $c): ?>
                <li>
                    <?php echo $c["posicion"]; ?>.
                    <?php echo (string)$c; ?>
                    (<?php echo $c["puntuacion"]; ?> puntos)
                </li>
            <?php endforeach; ?>
        </ul>
    </section>
</main>

</body>
</html>
