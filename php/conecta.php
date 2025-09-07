<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "adocao";

//Cria a conexão
$conexao = mysqli_connect($servername, $username, $password, $dbname);

// Verifica a conexão
if (!$conexao) {
    echo "Conexão falhou: Verifique!";
    return;
}
?>