const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Caminho do arquivo JSON para salvar os pets
const petsPath =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "pets.json") // Uso do diretório temporário no Vercel
    : path.join(__dirname, "../data/pets.json");

// Função para carregar os pets cadastrados
function carregarPets() {
  if (!fs.existsSync(petsPath)) {
    fs.writeFileSync(petsPath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(petsPath, "utf-8"));
}

// Rota GET - Exibe o formulário de cadastro de pets
router.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/cadastroPet.html"));
});

// Rota POST - Processa o cadastro e exibe a lista de pets
router.post("/cadastro", (req, res) => {
  const { nome, raca, idade } = req.body;

  // Validação dos campos obrigatórios
  if (!nome || !raca || !idade) {
    return res.send(`
      <script>
        alert("Todos os campos são obrigatórios!");
        window.location.href = "/pets/cadastro";
      </script>
    `);
  }

  try {
    // Carrega os pets e adiciona o novo pet
    const pets = carregarPets();
    pets.push({ nome, raca, idade });
    fs.writeFileSync(petsPath, JSON.stringify(pets, null, 2));

    // Gera o HTML da lista de pets cadastrados
    const listaHTML = pets
      .map(
        (pet) =>
          `<div class="item">
            <strong>Nome:</strong> ${pet.nome} |
            <strong>Raça:</strong> ${pet.raca} |
            <strong>Idade:</strong> ${pet.idade} anos
          </div>`
      )
      .join("");

    // Responde com a página de lista de pets
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <title>Lista de Pets Cadastrados</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            color: #333;
            text-align: center;
          }
          h1 {
            margin: 20px 0;
            color: #444;
          }
          .container {
            margin: 0 auto;
            max-width: 600px;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .item {
            margin: 10px 0;
            padding: 10px;
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: left;
          }
          .links {
            margin-top: 20px;
          }
          .links a {
            text-decoration: none;
            margin: 10px;
            color: #007bff;
            font-weight: bold;
            transition: color 0.3s ease;
          }
          .links a:hover {
            color: #0056b3;
          }
        </style>
      </head>
      <body>
        <h1>Lista de Pets Cadastrados</h1>
        <div class="container">
          ${listaHTML}
        </div>
        <div class="links">
          <a href="/pets/cadastro">Voltar ao Cadastro</a>
          <a href="/menu">Voltar ao Menu</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Erro ao processar cadastro de pets:", error);
    res.status(500).send("Erro interno ao salvar os dados.");
  }
});

module.exports = router;

