<?php
class Conexion {

    private $host = "localhost";
    private $usuario = "root";
    private $password = "";
    private $bd = "UO287694_DB";

    public function conectarServidor() {
        $conexion = new mysqli(
            $this->host,
            $this->usuario,
            $this->password
        );

        if ($conexion->connect_error) {
            die("Error de conexión al servidor: " . $conexion->connect_error);
        }

        return $conexion;
    }

    public function conectarBD() {
        $conexion = new mysqli(
            $this->host,
            $this->usuario,
            $this->password,
            $this->bd
        );

        if ($conexion->connect_error) {
            die("Error de conexión a la BD: " . $conexion->connect_error);
        }

        $conexion->set_charset("utf8mb4");
        return $conexion;
    }

    public function getNombreBD() {
        return $this->bd;
    }
}
?>

