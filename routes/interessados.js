const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Define o caminho do arquivo dependendo do ambiente
const interessadosPath =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "interessados.json") // Diretório temporário no Vercel
    : path.join(__dirname, "../data/interessados.json");

// Função para carregar os interessados cadastrados
function carregarInteressados() {
  if (!fs.existsSync(interessadosPath)) {
    fs.writeFileSync(interessadosPath, JSON.stringify([]), "utf-8");
  }
  return JSON.parse(fs.readFileSync(interessadosPath, "utf-8"));
}

// Rota GET - Exibe o formulário de cadastro
router.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/cadastroInteressado.html"));
});

// Rota POST - Processa o formulário e salva o interessado
router.post("/cadastro", (req, res) => {
  const { nome, email, telefone } = req.body;

  // Validação dos campos obrigatórios
  if (!nome || !email || !telefone) {
    return res.send(`
      <script>
        alert("Todos os campos são obrigatórios!");
        window.location.href = "/interessados/cadastro";
      </script>
    `);
  }

  // Adiciona o interessado no arquivo JSON
  try {
    const interessados = carregarInteressados();
    interessados.push({ nome, email, telefone });
    fs.writeFileSync(interessadosPath, JSON.stringify(interessados, null, 2));

    // Gera a lista de interessados
    let listaHTML = interessados
      .map(
        (interessado) =>
          `<div class="item">
            <strong>Nome:</strong> ${interessado.nome} |
            <strong>E-mail:</strong> ${interessado.email} |
            <strong>Telefone:</strong> ${interessado.telefone}
          </div>`
      )
      .join("");

    // Exibe a lista com estilo
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <title>Lista de Interessados</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            text-align: center;
          }
          h1 {
            margin: 20px 0;
            color: #444;
          }
          .container {
            margin: 30px auto;
            max-width: 600px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
            background-color: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .item {
            background-color: #f8f9fa;
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: left;
          }
          a {
            display: inline-block;
            margin: 10px;
            text-decoration: none;
            color: #007bff;
            font-weight: bold;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>Lista de Interessados</h1>
        <div class="container">
          ${listaHTML}
        </div>
        <a href="/interessados/cadastro">Voltar ao Cadastro</a>
        <a href="/menu">Voltar ao Menu</a>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Erro ao salvar interessado:", error);
    res.status(500).send("Erro interno ao salvar o interessado.");
  }
});

module.exports = router;
