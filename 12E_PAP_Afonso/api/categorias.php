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
    $stmt = $conn->query("SELECT id, nome FROM categoria ORDER BY nome");
    $categorias = $stmt ? $stmt->fetch_all(MYSQLI_ASSOC) : [];
    jsonResponse($categorias);
}

if ($method === 'POST') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
    $nome = trim((string)($data['nome'] ?? ''));
    if ($nome === '') {
        jsonResponse(['erro' => 'Nome é obrigatório'], 400);
    }

    $stmt = $conn->prepare("INSERT INTO categoria (nome) VALUES (?)");
    $stmt->bind_param("s", $nome);
    if ($stmt->execute()) {
        jsonResponse(['mensagem' => 'Categoria criada com sucesso', 'id' => $conn->insert_id]);
    }
    jsonResponse(['erro' => 'Erro ao criar categoria'], 400);
}

if ($method === 'PUT') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
    $id = (int)($data['id'] ?? 0);
    $nome = trim((string)($data['nome'] ?? ''));
    if ($id <= 0 || $nome === '') {
        jsonResponse(['erro' => 'ID e nome são obrigatórios'], 400);
    }

    $stmt = $conn->prepare("UPDATE categoria SET nome=? WHERE id=?");
    $stmt->bind_param("si", $nome, $id);
    if ($stmt->execute()) {
        jsonResponse(['mensagem' => 'Categoria atualizada com sucesso']);
    }
    jsonResponse(['erro' => 'Erro ao atualizar categoria'], 400);
}

if ($method === 'DELETE') {
    requireAdmin();
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        jsonResponse(['erro' => 'ID é obrigatório'], 400);
    }

    $stmt = $conn->prepare("DELETE FROM categoria WHERE id=?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        jsonResponse(['mensagem' => 'Categoria eliminada com sucesso']);
    }
    jsonResponse(['erro' => 'Erro ao eliminar categoria'], 400);
}

jsonResponse(['erro' => 'Método não permitido'], 405);

