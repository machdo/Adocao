<?php
include 'conecta.php';

// Verificar se foi solicitada exclusão
if (isset($_GET['deletar']) && isset($_GET['id'])) {
    $id_para_deletar = intval($_GET['id']);
    
    // Preparar e executar a query de exclusão
    $sql_delete = "DELETE FROM Apadrinhamento WHERE ID_Apadrinhamento = ?";
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
$sql = "SELECT ID_Apadrinhamento, ID_Dono, ID_Apadrinhado, DATE_FORMAT(Data_inicio, '%d/%m/%Y') as Data_formatada, Contribuicao_Mensal FROM Apadrinhamento ORDER BY ID_Apadrinhamento DESC";
$result = $conexao->query($sql);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Apadrinhados</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>

    <header>
        <a href="index.html"><button>Voltar</button></a>
    </header>

    <h1>Lista de Apadrinhados</h1>

    <?php if (isset($mensagem)): ?>
        <div class="mensagem <?= $tipo_mensagem ?>">
            <?= htmlspecialchars($mensagem) ?>
        </div>
    <?php endif; ?>

    <table>
        <tr>
            <th>ID do Apadrinhamento</th>
            <th>ID do Padrinho</th>
            <th>ID do Apadrinhado</th>
            <th>Data do Apadrinhado</th>
            <th>Contribuicao Mensal</th>
            <th>Ações</th>
        </tr>

        <?php if ($result->num_rows > 0): ?>
            <?php while ($row = $result->fetch_assoc()): ?>
                <tr>
                    <td><?= htmlspecialchars($row["ID_Apadrinhamento"]) ?></td>
                    <td><?= htmlspecialchars($row["ID_Dono"]) ?></td>
                    <td><?= htmlspecialchars($row["ID_Apadrinhado"]) ?></td>
                    <td><?= htmlspecialchars($row["Data_formatada"]) ?></td>
                    <td><?= htmlspecialchars($row["Contribuicao_Mensal"]) ?></td>
                    <td>
                        <a href="?deletar=1&id=<?= $row["ID_Apadrinhamento"] ?>" 
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
                <td colspan="6">Nenhum registro encontrado</td>
            </tr>
        <?php endif; ?>

    </table>    

</body>

</html>