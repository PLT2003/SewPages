<?php
require_once("conexion.php");

class Configuracion {

    private $conexionServidor;
    private $bd;

    public function __construct() {
        $db = new Conexion();
        $this->bd = $db->getNombreBD();
        $this->conexionServidor = $db->conectarServidor();
    }

    public function reiniciarBD() {
        $this->conexionServidor->query("
            CREATE DATABASE IF NOT EXISTS {$this->bd}
            CHARACTER SET utf8mb4
            COLLATE utf8mb4_spanish_ci
        ");

        $db = new Conexion();
        $conexionBD = $db->conectarBD();

        $this->crearTablas($conexionBD);

        $conexionBD->query("SET FOREIGN_KEY_CHECKS = 0");
        $conexionBD->query("TRUNCATE TABLE observaciones_facilitador");
        $conexionBD->query("TRUNCATE TABLE respuestas");
        $conexionBD->query("TRUNCATE TABLE tests_usabilidad");
        $conexionBD->query("TRUNCATE TABLE preguntas");
        $conexionBD->query("TRUNCATE TABLE usuarios");
        $conexionBD->query("SET FOREIGN_KEY_CHECKS = 1");
    }

    private function crearTablas($conexionBD) {

        $conexionBD->query("
            CREATE TABLE IF NOT EXISTS usuarios (
                id_usuario INT AUTO_INCREMENT PRIMARY KEY,
                profesion VARCHAR(100) NOT NULL,
                edad INT NOT NULL,
                genero VARCHAR(20) NOT NULL,
                pericia_informatica VARCHAR(50) NOT NULL
            )
        ");

        $conexionBD->query("
            CREATE TABLE IF NOT EXISTS preguntas (
                id_pregunta INT AUTO_INCREMENT PRIMARY KEY,
                texto_pregunta TEXT NOT NULL
            )
        ");

        $conexionBD->query("
            CREATE TABLE IF NOT EXISTS tests_usabilidad (
                id_test INT AUTO_INCREMENT PRIMARY KEY,
                id_usuario INT NOT NULL,
                dispositivo ENUM('ordenador','tableta','telefono'),
                tiempo_segundos INT NOT NULL,
                completado BOOLEAN NOT NULL,
                comentarios_usuario TEXT,
                propuestas_mejora TEXT,
                valoracion INT CHECK (valoracion BETWEEN 0 AND 10),
                FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
            )
        ");

        $conexionBD->query("
            CREATE TABLE IF NOT EXISTS respuestas (
                id_respuesta INT AUTO_INCREMENT PRIMARY KEY,
                id_test INT NOT NULL,
                id_pregunta INT NOT NULL,
                respuesta TEXT,
                FOREIGN KEY (id_test) REFERENCES tests_usabilidad(id_test),
                FOREIGN KEY (id_pregunta) REFERENCES preguntas(id_pregunta)
            )
        ");

        $conexionBD->query("
            CREATE TABLE IF NOT EXISTS observaciones_facilitador (
                id_observacion INT AUTO_INCREMENT PRIMARY KEY,
                id_test INT NOT NULL,
                comentarios TEXT NOT NULL,
                FOREIGN KEY (id_test) REFERENCES tests_usabilidad(id_test)
            )
        ");
    }

    public function eliminarBD() {
        $this->conexionServidor->query("DROP DATABASE IF EXISTS {$this->bd}");
    }

    public function exportarCSV($archivo = "export.csv") {
    $db = new Conexion();
    $conexion = $db->conectarBD();

    $query = "
        SELECT 
            u.id_usuario, u.profesion, u.edad, u.genero, u.pericia_informatica,
            t.id_test, t.dispositivo, t.tiempo_segundos, t.completado, t.comentarios_usuario, t.propuestas_mejora, t.valoracion,
            p.id_pregunta, p.texto_pregunta,
            r.respuesta,
            o.comentarios AS observaciones_facilitador
        FROM usuarios u
        LEFT JOIN tests_usabilidad t ON u.id_usuario = t.id_usuario
        LEFT JOIN respuestas r ON t.id_test = r.id_test
        LEFT JOIN preguntas p ON r.id_pregunta = p.id_pregunta
        LEFT JOIN observaciones_facilitador o ON t.id_test = o.id_test
        ORDER BY u.id_usuario, t.id_test, p.id_pregunta
    ";

    $result = $conexion->query($query);

    if (!$result) {
        die("Error en la consulta: " . $conexion->error);
    }

    header('Content-Type: text/csv; charset=utf-8');
    header("Content-Disposition: attachment; filename={$archivo}");

    $output = fopen('php://output', 'w');

    fputcsv($output, [
        'ID Usuario','Profesion','Edad','Genero','Pericia informatica',
        'ID Test','Dispositivo','Tiempo (s)','Completado','Comentarios Usuario','Propuestas Mejora','Valoracion',
        'ID Pregunta','Texto Pregunta','Respuesta','Observaciones Facilitador'
    ], ";");
    
    while ($row = $result->fetch_assoc()) {
        fputcsv($output, $row, ";");
    }

    fclose($output);
    exit;
}
}
?>
