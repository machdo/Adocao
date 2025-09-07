<?php
include 'conecta.php';

// Verificar se foi solicitada exclusão
if (isset($_GET['deletar']) && isset($_GET['id'])) {
    $id_para_deletar = intval($_GET['id']);
    
    // Preparar e executar a query de exclusão
    $sql_delete = "DELETE FROM Animal WHERE ID_Animal = ?";
    $stmt = $conexao->prepare($sql_delete);
    $stmt->bind_param("i", $id_para_deletar);
    
    if ($stmt->execute()) {
        $mensagem = "Registro deletado com sucesso!";
        $tipo_mensagem = "sucesso";
    } else {
        $mensagem = "Erro ao deletar registro: " . $conexao->error;
        $tipo_mensagem = "erro";
    }
    $stmt->close();
}

// consulta ao banco
$sql = "SELECT ID_Animal, Nome, Idade, Raca, Cor, Ficha_saude, Disp FROM Animal ORDER BY ID_Animal DESC";
$result = $conexao->query($sql);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Animais</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>

    <header>
        <a href="index.html"><button>Voltar</button></a>
    </header>

    <h1>Lista de Animais</h1>

    <table>
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Idade</th>
            <th>Raça</th>
            <th>Cor</th>
            <th>Ficha de Saúde</th>
            <th>Disponibilidade</th>
            <th>Ações</th>
        </tr>

        <?php if ($result->num_rows > 0): ?>
            <?php while ($row = $result->fetch_assoc()): ?>
                <tr>
                    <td><?= $row["ID_Animal"] ?></td>
                    <td><?= $row["Nome"] ?></td>
                    <td><?= $row["Idade"] ?></td>
                    <td><?= $row["Raca"] ?></td>
                    <td><?= $row["Cor"] ?></td>
                    <td><?= $row["Ficha_saude"] ?></td>
                    <td><?= $row["Disp"] ?></td>
                    <td>
                    <a href="?deletar=1&id=<?= $row["ID_Animal"] ?>" 
                           onclick="return confirm('Tem certeza que deseja deletar este registro?')">
                            <button class="btn-deletar">
                                Deletar
                            </button>
                        </a>
                    </td>
                </tr>
            <?php endwhile; ?>
        <?php else: ?>
            <tr>
                <td colspan="8">Nenhum registro encontrado</td>
            </tr>
        <?php endif; ?>

    </table>    

    <script>
        function abrirConfig(ID_Animal) {
            window.location.href = "configurar.php?id=" + ID_Animal;
            // aqui você pode abrir um modal, redirecionar, ou exibir opções
        }
    </script>


</body>

</html>