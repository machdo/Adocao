<?php
include 'conecta.php';



// consulta ao banco
$sql = "SELECT ID_Padrinho, Nome, Idade, CPF, Email, Telefone FROM padrinho ORDER BY ID_Padrinho DESC";
$result = $conexao->query($sql);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Padrinhos</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>

    <header>
        <a href="index.html"><button>Voltar</button></a>
    </header>

    <h1>Lista de Padrinhos</h1>

    <table>
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Idade</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
        </tr>

        <?php if ($result->num_rows > 0): ?>
            <?php while ($row = $result->fetch_assoc()): ?>
                <tr>
                    <td><?= $row["ID_Padrinho"] ?></td>
                    <td><?= $row["Nome"] ?></td>
                    <td><?= $row["Idade"] ?></td>
                    <td><?= $row["CPF"] ?></td>
                    <td><?= $row["Email"] ?></td>
                    <td><?= $row["Telefone"] ?></td>
                    <td>
                    <a href="?deletar=1&id=<?= $row["ID_Padrinho"] ?>" 
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
        function abrirConfig(ID_Padrinho) {
            window.location.href = "configurar.php?id=" + ID_Padrinho;
            // aqui você pode abrir um modal, redirecionar, ou exibir opções
        }
    </script>


</body>

</html>