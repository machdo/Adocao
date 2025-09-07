<?php 

require('conecta.php');

$nome = $_POST['nome'];
$idade = $_POST['idade'];
$cpf = $_POST['cpf'];
$email = $_POST['email'];
$tel = $_POST['telefone'];

$sql = "INSERT INTO padrinho (Nome, Idade, CPF, Email, Telefone) VALUES ('$nome', '$idade', '$cpf', '$email', '$tel')";

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
            <h1>Padrinho Cadastrado com Sucesso!</h1>
            <p>O padrinho <strong><?= htmlspecialchars($nome) ?></strong> foi cadastrado no sistema.</p>
            <div>
                <a href="index.html" class="botoes">Voltar ao Início</a>
                <a href="cdst_padrinho.html" class="botoes">Cadastrar Outro</a>
                <a href="lista_padrinho.php" class="botoes">Ver Lista</a>
            </div>
        </div>
    <?php else: ?>
        <div class="error-page">
            <h1>Erro ao Salvar</h1>
            <p>Ocorreu um problema ao cadastrar o padrinho. Tente novamente.</p>
            <a href="cdst_padrinho.html" class="botoes">Tentar Novamente</a>
        </div>
    <?php endif; ?>
</body>
</html>