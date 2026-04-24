<?php
require_once 'db.php';

session_start();

function requireAdmin() {
    if (empty($_SESSION['is_admin'])) {
        jsonResponse(['erro' => 'NÃ£o autorizado'], 401);
    }
}

function getJsonInput() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function getRequestData() {
    if (!empty($_POST) || !empty($_FILES)) {
        return $_POST;
    }
    return getJsonInput();
}

function normalizeNullableInt($value) {
    if ($value === '' || $value === null) {
        return null;
    }
    return (int)$value;
}

function saveUploadedImage($fieldName = 'imagem_file') {
    if (empty($_FILES[$fieldName]) || !is_array($_FILES[$fieldName])) {
        return null;
    }

    $file = $_FILES[$fieldName];
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
        jsonResponse(['erro' => 'Erro ao enviar a imagem.'], 400);
    }

    $tmpPath = $file['tmp_name'] ?? '';
    if ($tmpPath === '' || !is_uploaded_file($tmpPath)) {
        jsonResponse(['erro' => 'Upload de imagem invÃ¡lido.'], 400);
    }

    $mime = mime_content_type($tmpPath);
    $allowedTypes = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/gif' => 'gif',
        'image/webp' => 'webp',
    ];

    if (!isset($allowedTypes[$mime])) {
        jsonResponse(['erro' => 'Formato de imagem nÃ£o suportado. Usa JPG, PNG, GIF ou WEBP.'], 400);
    }

    $uploadDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'imagens';
    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0777, true) && !is_dir($uploadDir)) {
        jsonResponse(['erro' => 'NÃ£o foi possÃ­vel preparar a pasta de imagens.'], 500);
    }

    $originalName = pathinfo($file['name'] ?? 'imagem', PATHINFO_FILENAME);
    $safeBaseName = preg_replace('/[^a-zA-Z0-9_-]/', '-', $originalName);
    $safeBaseName = trim($safeBaseName, '-');
    if ($safeBaseName === '') {
        $safeBaseName = 'imagem';
    }

    $fileName = $safeBaseName . '-' . uniqid('', true) . '.' . $allowedTypes[$mime];
    $targetPath = $uploadDir . DIRECTORY_SEPARATOR . $fileName;

    if (!move_uploaded_file($tmpPath, $targetPath)) {
        jsonResponse(['erro' => 'NÃ£o foi possÃ­vel guardar a imagem enviada.'], 500);
    }

    return 'imagens/' . $fileName;
}

function saveBase64Image($base64Data, $originalName = 'imagem') {
    $base64Data = trim((string)$base64Data);
    if ($base64Data === '') {
        return null;
    }

    if (!preg_match('/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/', $base64Data, $matches)) {
        jsonResponse(['erro' => 'Formato de imagem invÃ¡lido.'], 400);
    }

    $mime = strtolower($matches[1]);
    $binary = base64_decode($matches[2], true);
    if ($binary === false) {
        jsonResponse(['erro' => 'NÃ£o foi possÃ­vel processar a imagem enviada.'], 400);
    }

    $allowedTypes = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/gif' => 'gif',
        'image/webp' => 'webp',
    ];

    if (!isset($allowedTypes[$mime])) {
        jsonResponse(['erro' => 'Formato de imagem nÃ£o suportado. Usa JPG, PNG, GIF ou WEBP.'], 400);
    }

    $uploadDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'imagens';
    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0777, true) && !is_dir($uploadDir)) {
        jsonResponse(['erro' => 'NÃ£o foi possÃ­vel preparar a pasta de imagens.'], 500);
    }

    $safeName = pathinfo((string)$originalName, PATHINFO_FILENAME);
    $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '-', $safeName);
    $safeName = trim($safeName, '-');
    if ($safeName === '') {
        $safeName = 'imagem';
    }

    $fileName = $safeName . '-' . uniqid('', true) . '.' . $allowedTypes[$mime];
    $targetPath = $uploadDir . DIRECTORY_SEPARATOR . $fileName;

    if (file_put_contents($targetPath, $binary) === false) {
        jsonResponse(['erro' => 'NÃ£o foi possÃ­vel guardar a imagem enviada.'], 500);
    }

    return 'imagens/' . $fileName;
}

$method = $_SERVER['REQUEST_METHOD'];
$conn = getConnection();

if ($method === 'GET') {
    $categoriaId = (int)($_GET['categoria_id'] ?? 0);
    $slider = isset($_GET['slider']) ? (int)$_GET['slider'] : null;
    $q = trim((string)($_GET['q'] ?? ''));

    $sql = "SELECT l.*, c.nome as categoria_nome FROM local l LEFT JOIN categoria c ON l.categoria_id = c.id";
    $params = [];
    $types = "";
    $where = [];

    if ($categoriaId > 0) {
        $where[] = "l.categoria_id = ?";
        $types .= "i";
        $params[] = $categoriaId;
    }

    if ($slider === 1) {
        $where[] = "l.mostrar_slider = 1";
    }

    if ($q !== '') {
        $where[] = "(l.nome LIKE ? OR l.descricao LIKE ? OR l.distrito LIKE ?)";
        $types .= "sss";
        $like = "%" . $q . "%";
        $params[] = $like;
        $params[] = $like;
        $params[] = $like;
    }

    if (count($where) > 0) {
        $sql .= " WHERE " . implode(" AND ", $where);
    }

    $sql .= " ORDER BY l.id";

    if (count($params) === 0) {
        $stmt = $conn->query($sql);
        $locais = $stmt ? $stmt->fetch_all(MYSQLI_ASSOC) : [];
        jsonResponse($locais);
    }

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $res = $stmt->get_result();
    $locais = $res ? $res->fetch_all(MYSQLI_ASSOC) : [];
    jsonResponse($locais);
}
elseif ($method === 'POST') {
    requireAdmin();
    $data = getRequestData();
    $id = (int)($data['id'] ?? 0);

    $nome = trim((string)($data['nome'] ?? ''));
    $descricao = trim((string)($data['descricao'] ?? ''));
    $distrito = trim((string)($data['distrito'] ?? ''));
    $categoria_id = (int)($data['categoria_id'] ?? 1);
    $imagem = trim((string)($data['imagem'] ?? ''));
    $icone = trim((string)($data['icone'] ?? ''));
    $subtitulo = trim((string)($data['subtitulo'] ?? ''));
    $preco = trim((string)($data['preco'] ?? ''));
    $extras_json = (string)($data['extras_json'] ?? '');
    $pos_x = normalizeNullableInt($data['pos_x'] ?? null);
    $pos_y = normalizeNullableInt($data['pos_y'] ?? null);
    $mostrar_slider = !empty($data['mostrar_slider']) ? 1 : 0;

    if ($nome === '') {
        jsonResponse(['erro' => 'O nome Ã© obrigatÃ³rio.'], 400);
    }

    $uploadedImagePath = null;
    if (!empty($data['imagem_base64'])) {
        $uploadedImagePath = saveBase64Image($data['imagem_base64'], $data['imagem_nome'] ?? 'imagem');
    } else {
        $uploadedImagePath = saveUploadedImage();
    }
    if ($uploadedImagePath !== null) {
        $imagem = $uploadedImagePath;
    }

    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE local SET nome=?, descricao=?, distrito=?, categoria_id=?, imagem=?, icone=?, subtitulo=?, preco=?, extras_json=?, pos_x=?, pos_y=?, mostrar_slider=? WHERE id=?");
        $stmt->bind_param("sssisssssiiii", $nome, $descricao, $distrito, $categoria_id, $imagem, $icone, $subtitulo, $preco, $extras_json, $pos_x, $pos_y, $mostrar_slider, $id);

        if ($stmt->execute()) {
            jsonResponse(['mensagem' => 'Local atualizado com sucesso']);
        }

        jsonResponse(['erro' => 'Erro ao atualizar local'], 400);
    }

    $stmt = $conn->prepare("INSERT INTO local (nome, descricao, distrito, categoria_id, imagem, icone, subtitulo, preco, extras_json, pos_x, pos_y, mostrar_slider) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssisssssiii", $nome, $descricao, $distrito, $categoria_id, $imagem, $icone, $subtitulo, $preco, $extras_json, $pos_x, $pos_y, $mostrar_slider);

    if ($stmt->execute()) {
        jsonResponse(['mensagem' => 'Local criado com sucesso', 'id' => $conn->insert_id]);
    }

    jsonResponse(['erro' => 'Erro ao criar local'], 400);
}
elseif ($method === 'PUT') {
    requireAdmin();
    $data = getJsonInput();
    $id = (int)($data['id'] ?? 0);

    $nome = trim((string)($data['nome'] ?? ''));
    $descricao = trim((string)($data['descricao'] ?? ''));
    $distrito = trim((string)($data['distrito'] ?? ''));
    $categoria_id = (int)($data['categoria_id'] ?? 1);
    $imagem = trim((string)($data['imagem'] ?? ''));
    $icone = trim((string)($data['icone'] ?? ''));
    $subtitulo = trim((string)($data['subtitulo'] ?? ''));
    $preco = trim((string)($data['preco'] ?? ''));
    $extras_json = (string)($data['extras_json'] ?? '');
    $pos_x = normalizeNullableInt($data['pos_x'] ?? null);
    $pos_y = normalizeNullableInt($data['pos_y'] ?? null);
    $mostrar_slider = !empty($data['mostrar_slider']) ? 1 : 0;

    $stmt = $conn->prepare("UPDATE local SET nome=?, descricao=?, distrito=?, categoria_id=?, imagem=?, icone=?, subtitulo=?, preco=?, extras_json=?, pos_x=?, pos_y=?, mostrar_slider=? WHERE id=?");
    $stmt->bind_param("sssisssssiiii", $nome, $descricao, $distrito, $categoria_id, $imagem, $icone, $subtitulo, $preco, $extras_json, $pos_x, $pos_y, $mostrar_slider, $id);

    if ($stmt->execute()) {
        jsonResponse(['mensagem' => 'Local atualizado com sucesso']);
    }

    jsonResponse(['erro' => 'Erro ao atualizar local'], 400);
}
elseif ($method === 'DELETE') {
    requireAdmin();
    $id = $_GET['id'] ?? 0;

    $stmt = $conn->prepare("DELETE FROM local WHERE id=?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        jsonResponse(['mensagem' => 'Local eliminado com sucesso']);
    }

    jsonResponse(['erro' => 'Erro ao eliminar local'], 400);
}
