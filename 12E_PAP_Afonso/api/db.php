<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'turismo');

function getConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['erro' => 'Erro na conexão: ' . $conn->connect_error], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $conn->set_charset('utf8mb4');
    ensureLocalSliderColumn($conn);
    return $conn;
}

function ensureLocalSliderColumn($conn) {
    static $checked = false;
    if ($checked) return;

    $checked = true;
    $sql = "SELECT 1
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = ?
              AND TABLE_NAME = 'local'
              AND COLUMN_NAME = 'mostrar_slider'
            LIMIT 1";

    $stmt = $conn->prepare($sql);
    if (!$stmt) return;

    $dbName = DB_NAME;
    $stmt->bind_param('s', $dbName);
    $stmt->execute();
    $res = $stmt->get_result();
    $exists = $res && $res->fetch_row();
    $stmt->close();

    if ($exists) return;

    $conn->query("ALTER TABLE local ADD COLUMN mostrar_slider TINYINT(1) NOT NULL DEFAULT 0 AFTER pos_y");
}

function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
