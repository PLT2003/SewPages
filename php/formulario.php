<?php
session_start();
require_once("conexion.php");

if (isset($_POST['resetear'])) {
    session_unset();
    session_destroy();
    header("Location: formulario.php");
    exit;
}

class Cronometro {
    private $inicio;
    private $tiempo = 0;

    public function arrancar() {
        $this->inicio = microtime(true);
    }

    public function parar() {
        if ($this->inicio) {
            $this->tiempo = microtime(true) - $this->inicio;
        }
    }

    public function getTiempo() {
        return (int)$this->tiempo;
    }
}

if (!isset($_SESSION['cronometro'])) {
    $_SESSION['cronometro'] = new Cronometro();
}

if (!isset($_SESSION['fase'])) {
    $_SESSION['fase'] = 'usuario';
}

if (isset($_POST['iniciar_prueba']) && $_SESSION['fase'] === 'usuario') {
    if (!empty($_POST['profesion']) && !empty($_POST['edad']) && !empty($_POST['genero']) && !empty($_POST['pericia'])) {

        $db = new Conexion();
        $conexion = $db->conectarBD();

        $stmt = $conexion->prepare("
            INSERT INTO usuarios (profesion, edad, genero, pericia_informatica)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->bind_param(
            "sisi",
            $_POST['profesion'],
            $_POST['edad'],
            $_POST['genero'],
            $_POST['pericia']
        );
        $stmt->execute();

        $_SESSION['id_usuario'] = $conexion->insert_id;
        $_SESSION['fase'] = 'preguntas';
        $_SESSION['cronometro']->arrancar();
    } else {
        $error = "Debes rellenar todos los campos.";
    }
}

if (isset($_POST['siguiente']) && $_SESSION['fase'] === 'preguntas') {

    $_SESSION['cronometro']->parar();
    $tiempo = $_SESSION['cronometro']->getTiempo();

    $db = new Conexion();
    $conexion = $db->conectarBD();

    $stmt = $conexion->prepare("
        INSERT INTO tests_usabilidad (id_usuario, tiempo_segundos, completado)
        VALUES (?, ?, 0)
    ");
    $stmt->bind_param("ii", $_SESSION['id_usuario'], $tiempo);
    $stmt->execute();

    $_SESSION['id_test'] = $conexion->insert_id;

    for ($id = 1; $id <= 10; $id++) {
        $stmt = $conexion->prepare("
            INSERT INTO respuestas (id_test, id_pregunta, respuesta)
            VALUES (?, ?, ?)
        ");
        $stmt->bind_param(
            "iis",
            $_SESSION['id_test'],
            $id,
            $_POST["respuesta_$id"]
        );
        $stmt->execute();
    }

    $_SESSION['fase'] = 'otros';
}

if (isset($_POST['terminar_prueba']) && $_SESSION['fase'] === 'otros') {

    $db = new Conexion();
    $conexion = $db->conectarBD();

    $stmt = $conexion->prepare("
        UPDATE tests_usabilidad
        SET dispositivo=?, comentarios_usuario=?, propuestas_mejora=?, valoracion=?, completado=1
        WHERE id_test=?
    ");
    $stmt->bind_param(
        "sssii",
        $_POST['dispositivo'],
        $_POST['comentarios_usuario'],
        $_POST['propuestas_mejora'],
        $_POST['valoracion'],
        $_SESSION['id_test']
    );
    $stmt->execute();

    if (!empty($_POST['comentarios_facilitador'])) {
        $stmt = $conexion->prepare("
            INSERT INTO observaciones_facilitador (id_test, comentarios)
            VALUES (?, ?)
        ");
        $stmt->bind_param("is", $_SESSION['id_test'], $_POST['comentarios_facilitador']);
        $stmt->execute();
    }

    // 🔁 REINICIAR FORMULARIO
    session_unset();
    session_destroy();

    header("Location: formulario.php?fin=1");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Prueba de usabilidad</title>

    <link rel="icon" href="../multimedia/favicon.ico" type="image/x-icon">
    <meta name="author" content="Pablo López Tamargo" />
    <meta name="description" content="Pruebas de usabilidad" />
    <meta name="keywords" content="Usabilidad, formulario" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
</head>
<body>

<header>
    <h1>
        <a href="../index.html">MotoGP-Desktop</a>
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

<p>Estás en: Inicio >> Juegos >> Formulario usabilidad</p>

<form method="post">
    <button type="submit" name="resetear">Reiniciar prueba</button>
</form>

<?php if (isset($error)) echo "<p>$error</p>"; ?>
<?php if (isset($_GET['fin'])): ?>
    <p>Prueba finalizada correctamente.</p>
<?php endif; ?>


<?php if ($_SESSION['fase'] === 'usuario'): ?>
<form method="post">
    <p>Profesión</p>
    <input type="text" name="profesion" required>

    <p>Edad</p>
    <input type="number" name="edad" required>

    <p>Género</p>
    <select name="genero">
        <option value="Hombre" selected>Hombre</option>
        <option value="Mujer">Mujer</option>
        <option value="Otro">Otro</option>
    </select>

    <p>Pericia informática (1–10)</p>
    <input type="number" name="pericia" min="1" max="10" required>

    <br><br>
    <button type="submit" name="iniciar_prueba">Iniciar prueba</button>
</form>
<?php endif; ?>

<?php if ($_SESSION['fase'] === 'preguntas'): ?>
<form method="post">
<?php
$preguntas = [
    1 => "Encuentra el juego de memoria y juega una partida. Ingresa el tiempo que has tardado.",
    2 => "Encuentra e ingresa los puntos obtenidos por Jorge Martín en la temporada de 2024.",
    3 => "Accede a la página oficial de MotoGP desde MotoGP-Desktop.",
    4 => "Encuentra e ingresa la lluvia media en el entrenamiento de la fecha 2024-10-24.",
    5 => "Encuentra el cronómetro y arráncalo durante 5 segundos y reinícialo.",
    6 => "Encuentra la ayuda y lee el párrafo sobre clasificación.",
    7 => "Encuentra una noticia e ingresa el título.",
    8 => "Encuentra y mira unos 3 segundos del video sobre Jorge Martín",
    9 => "Encuentra e ingresa el tiempo del ganador de la carrera en el Chang International Circuit",
    10 => "Navega hasta el inicio desde 3 lugares de la aplicación usando las migas de navegación"
];
$siono = [3,5,6,8,10];

foreach ($preguntas as $id => $texto):
?>
    <p><?= $texto ?></p>

    <?php if (in_array($id, $siono)): ?>
        <select name="respuesta_<?= $id ?>">
            <option value="No" selected>No</option>
            <option value="Si">Sí</option>
        </select>
    <?php else: ?>
        <input type="text" name="respuesta_<?= $id ?>" required>
    <?php endif; ?>

<?php endforeach; ?>

    <br><br>
    <button type="submit" name="siguiente">Terminar prueba</button>
</form>
<?php endif; ?>

<?php if ($_SESSION['fase'] === 'otros'): ?>
<form method="post">
    <p>Dispositivo</p>
    <select name="dispositivo" >
        <option value="ordenador" selected>Ordenador</option>
        <option value="tableta">Tableta</option>
        <option value="telefono">Teléfono</option>
    </select>

    <p>Comentarios del usuario</p>
    <textarea name="comentarios_usuario"></textarea>

    <p>Propuestas de mejora</p>
    <textarea name="propuestas_mejora"></textarea>

    <p>Valoración (0–10)</p>
    <input type="number" name="valoracion" min="0" max="10" required>

    <p>Observaciones del facilitador</p>
    <textarea name="comentarios_facilitador"></textarea>

    <br><br>
    <button type="submit" name="terminar_prueba">Guardar</button>
</form>
<?php endif; ?>

</body>
</html>
