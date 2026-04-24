<?php
require_once __DIR__ . '/db.php';

session_start();

function requireAdmin() {
    if (empty($_SESSION['is_admin'])) {
        jsonResponse(['erro' => 'Não autorizado'], 401);
    }
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$conn = getConnection();

if ($method === 'GET') {
    $chave = trim((string)($_GET['chave'] ?? ''));
    if ($chave !== '') {
        $stmt = $conn->prepare("SELECT chave, valor FROM conteudo WHERE chave=? LIMIT 1");
        $stmt->bind_param("s", $chave);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res ? $res->fetch_assoc() : null;
        jsonResponse($row ?: ['chave' => $chave, 'valor' => null]);
    }

    $stmt = $conn->query("SELECT chave, valor FROM conteudo ORDER BY chave");
    $itens = $stmt ? $stmt->fetch_all(MYSQLI_ASSOC) : [];
    jsonResponse($itens);
}

if ($method === 'PUT') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
    $chave = trim((string)($data['chave'] ?? ''));
    $valor = (string)($data['valor'] ?? '');
    if ($chave === '') {
        jsonResponse(['erro' => 'Chave é obrigatória'], 400);
    }

    $stmt = $conn->prepare("INSERT INTO conteudo (chave, valor) VALUES (?, ?) ON DUPLICATE KEY UPDATE valor=VALUES(valor)");
    $stmt->bind_param("ss", $chave, $valor);
    if ($stmt->execute()) {
        jsonResponse(['mensagem' => 'Conteúdo guardado com sucesso']);
    }
    jsonResponse(['erro' => 'Erro ao guardar conteúdo'], 400);
}

jsonResponse(['erro' => 'Método não permitido'], 405);

