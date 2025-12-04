class Cronometro {
    private $tiempo;
    private $inicio;

    public function __construct() {
        $this -> tiempo = 0;
    }

    public function arrancar() {
        $this -> inicio = microtime(true);
    }

    public function parar() {
        $this -> tiempo = microtime(true) - $this -> inicio;
    }

    public function mostrar() {
        $totalSegundos = floor($this->tiempo);
        $decimas = floor(($this->tiempo - $totalSegundos) * 10);

        $minutos = floor($totalSegundos / 60);
        $segundos = $totalSegundos % 60;

        // Formato mm:ss.s
        return sprintf("%02d:%02d.%d", $minutos, $segundos, $decimas);
    }
}

<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>MotoGP-Clasificaciones</title>

    <link rel="icon" href="multimedia/favicon.ico" type="image/x-icon">

    <meta name="author" content="Pablo López Tamargo" />
    <meta name="description" content="Cronómetro PHP de MotoGP-Desktop" />
    <meta name="keywords" content="PHP" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
</head>

<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <header>
        <h1><a href="index.html" title="Página inicial de MotoGP-Desktop">MotoGP-Desktop</a></h1>
        <nav>
            <a href="index.html" title="Página inicial de MotoGP-Desktop">Inicio</a>
            <a href="piloto.html" title="Información del piloto">Piloto</a>
            <a href="circuito.html" title="Información sobre los circuitos">Circuito</a>
            <a href="meteorologia.html" title="Información sobre la meteorología">Meteorología</a>
            <a href="clasificaciones.html" title="Información sobre las clasificaciones" class="active">Clasificaciones</a>
            <a href="juegos.html" title="Juegos de MotoGP-Desktop">Juegos</a>
            <a href="ayuda.html" title="Ayuda sobre MotoGP-Desktop">Ayuda</a>
        </nav>
    </header>

    <p>Estás en: <a href="index.html" title="Página inicial de MotoGP-Desktop">Inicio</a> >> <strong>Clasificaciones</strong></p>
    
    <main>
        <h2>Cronómetro</h2>
        <p>00:00.0</p>
        <button>Arrancar</button>
        <button>Parar</button>
        <button>Reiniciar</button>
    </main>
</body>
</html>