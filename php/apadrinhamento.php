<?php

require('conecta.php');

$id_padri = $_POST['id_padrinho'];
$id_animal = $_POST['id_animal'];
$vl_mensal = $_POST['vl_mensal'];

$sql = "INSERT INTO apadrinhamento (ID_Dono, ID_Apadrinhado, Contribuicao_Mensal) VALUES ('$id_padri', '$id_animal', '$vl_mensal')";

$gravar = mysqli_query($conexao, $sql);
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $gravar ? 'Sucesso!' : 'Erro' ?></title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <?php if ($gravar): ?>
        <div class="success-page">
            <h1>Apadrinhamento Realizado!</h1>
            <p>O apadrinhamento foi registrado com sucesso no sistema.</p>
            <p><strong>Padrinho ID:</strong> <?= htmlspecialchars($id_padri) ?> | 
               <strong>Animal ID:</strong> <?= htmlspecialchars($id_animal) ?> | 
               <strong>Valor:</strong> R$ <?= htmlspecialchars($vl_mensal) ?></p>
            <div>
                <a href="index.html" class="botoes">Voltar ao Início</a>
                <a href="apadrinhamento.html" class="botoes">Novo Apadrinhamento</a>
                <a href="lista_apadrinhados.php" class="botoes">Ver Lista</a>
            </div>
        </div>
    <?php else: ?>
        <div class="error-page">
            <h1>Erro ao Salvar</h1>
            <p>Ocorreu um problema ao registrar o apadrinhamento. Verifique se os IDs existem e tente novamente.</p>
            <a href="apadrinhamento.html" class="botoes">Tentar Novamente</a>
        </div>
    <?php endif; ?>
</body>
</html>