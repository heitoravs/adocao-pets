const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const petsPath = path.join(__dirname, "../data/pets.json");

function carregarPets() {
  if (!fs.existsSync(petsPath)) {
    fs.writeFileSync(petsPath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(petsPath, "utf-8"));
}

router.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/cadastroPet.html"));
});

router.post("/cadastro", (req, res) => {
  const { nome, raca, idade } = req.body;

  if (!nome || !raca || !idade) {
    return res.send(`
      <script>
        alert("Todos os campos são obrigatórios!");
        window.location.href = "/pets/cadastro";
      </script>
    `);
  }

  const pets = carregarPets();
  pets.push({ nome, raca, idade });
  fs.writeFileSync(petsPath, JSON.stringify(pets, null, 2));

  let listaHTML = pets
    .map(
      (pet) =>
        `<li><strong>Nome:</strong> ${pet.nome} | <strong>Raça:</strong> ${pet.raca} | <strong>Idade:</strong> ${pet.idade} anos</li>`
    )
    .join("");

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Lista de Pets</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        h1 {
          color: #444;
          text-align: center;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          background-color: #fff;
          margin: 10px 0;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .links {
          text-align: center;
          margin-top: 20px;
        }
        .links a {
          text-decoration: none;
          color: #007bff;
          font-weight: bold;
          margin: 0 10px;
          transition: color 0.3s ease;
        }
        .links a:hover {
          color: #0056b3;
        }
      </style>
    </head>
    <body>
      <h1>Lista de Pets Cadastrados</h1>
      <ul>${listaHTML}</ul>
      <div class="links">
        <a href="/pets/cadastro">Voltar ao Cadastro</a>
        <a href="/menu">Voltar ao Menu</a>
      </div>
    </body>
    </html>
  `);
});

module.exports = router;
