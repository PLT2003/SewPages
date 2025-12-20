<?php
require_once("Configuracion.class.php");
$config = new Configuracion();

if (isset($_POST['accion'])) {
    switch ($_POST['accion']) {
        case 'reiniciar':
            $config->reiniciarBD();
            $mensaje = "Base de datos reiniciada correctamente.";
            break;

        case 'eliminar':
            $config->eliminarBD();
            $mensaje = "Base de datos eliminada.";
            break;

        case 'exportar':
            $config->exportarCSV();
            break;
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Configuración prueba de usabilidad</title>

    <link rel="icon" href="../multimedia/favicon.ico" type="image/x-icon">

    <meta name="author" content="Pablo López Tamargo" />
    <meta name="description" content="Configuración de Pruebas de usabilidad" />
    <meta name="keywords" content="Configuración, base de datos" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
</head>
<body>

<header>
    <h1>
        <a href="../index.html" title="Página inicial de MotoGP-Desktop">
            MotoGP-Desktop
        </a>
    </h1>
    <nav>
        <a href="../index.html">Inicio</a>
        <a href="../piloto.html">Piloto</a>
        <a href="../circuito.html">Circuito</a>
        <a href="../meteorologia.html">Meteorología</a>
        <a href="../clasificaciones.php">Clasificaciones</a>
        <a href="../juegos.html" class="active">Juegos</a>
        <a href="../ayuda.html">Ayuda</a>
    </nav>
</header>
<p>Estás en: <a href="../index.html" title="Página inicial de MotoGP-Desktop">Inicio</a> >> <a href="../juegos.html" title="Juegos de MotoGP-Desktop">Juegos</a> >> <strong>Configuración pruebas de usabilidad</strong></p>

<h1>Configuración del Test de Usabilidad</h1>

<?php if (isset($mensaje)) echo "<p><strong>$mensaje</strong></p>"; ?>

<form method="post">
    <button type="submit" name="accion" value="reiniciar">
        Reiniciar base de datos
    </button>

    <button type="submit" name="accion" value="exportar">
        Exportar datos (CSV)
    </button>

    <button type="submit" name="accion" value="eliminar"
            onclick="return confirm('¿Seguro que deseas eliminar la base de datos?');">
        Eliminar base de datos
    </button>
</form>

</body>
</html>
