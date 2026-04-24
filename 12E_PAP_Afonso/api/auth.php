<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/config.php';

session_start();

function requireMethod($method) {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
        jsonResponse(['erro' => 'Método não permitido'], 405);
    }
}

$action = $_GET['action'] ?? '';

if ($action === 'me') {
    requireMethod('GET');
    $isAdmin = !empty($_SESSION['is_admin']);
    jsonResponse(['is_admin' => $isAdmin]);
}

if ($action === 'login') {
    requireMethod('POST');
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
    $pin = (string)($data['pin'] ?? '');

    if ($pin !== (string)ADMIN_PIN) {
        jsonResponse(['erro' => 'PIN inválido'], 401);
    }

    $_SESSION['is_admin'] = true;
    jsonResponse(['mensagem' => 'Login efetuado com sucesso']);
}

if ($action === 'logout') {
    requireMethod('POST');
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
    jsonResponse(['mensagem' => 'Logout efetuado com sucesso']);
}

jsonResponse(['erro' => 'Ação inválida'], 400);

