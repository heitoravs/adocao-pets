const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const interessadosPath =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "interessados.json")
    : path.join(__dirname, "../data/interessados.json");

const petsPath =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "pets.json")
    : path.join(__dirname, "../data/pets.json");

const adocoesPath =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "adocoes.json")
    : path.join(__dirname, "../data/adocoes.json");

function carregarDados(caminho) {
  try {
    if (!fs.existsSync(caminho)) {
      fs.writeFileSync(caminho, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(caminho, "utf-8"));
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    return [];
  }
}

function salvarDados(caminho, dados) {
  try {
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
  }
}

router.get("/lista", (req, res) => {
  const interessados = carregarDados(interessadosPath);
  const pets = carregarDados(petsPath);

  let interessadosOptions = interessados
    .map((int) => `<option value="${int.nome}">${int.nome}</option>`)
    .join("");

  let petsOptions = pets
    .map((pet) => `<option value="${pet.nome}">${pet.nome}</option>`)
    .join("");

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Adotar um Pet</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .container {
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          text-align: center;
        }
        h1 {
          color: #444;
          margin-bottom: 20px;
        }
        select, button {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 1rem;
        }
        button {
          background-color: #28a745;
          color: white;
          border: none;
          cursor: pointer;
        }
        button:hover {
          background-color: #218838;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Adotar um Pet</h1>
        <form action="/adocao/adotar" method="POST">
          <label for="interessado">Interessado:</label>
          <select id="interessado" name="interessado" required>
            <option value="">Selecione um interessado</option>
            ${interessadosOptions}
          </select>
          <label for="pet">Pet:</label>
          <select id="pet" name="pet" required>
            <option value="">Selecione um pet</option>
            ${petsOptions}
          </select>
          <button type="submit">Registrar Adoção</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

router.post("/adotar", (req, res) => {
  const { interessado, pet } = req.body;

  if (!interessado || !pet) {
    return res.send(`
      <script>
        alert("Todos os campos são obrigatórios!");
        window.location.href = "/adocao/lista";
      </script>
    `);
  }

  const adocoes = carregarDados(adocoesPath);
  const novaAdocao = {
    interessado,
    pet,
    data: new Date().toLocaleString("pt-BR"),
  };

  adocoes.push(novaAdocao);
  salvarDados(adocoesPath, adocoes);

  const listaHTML = adocoes
    .map(
      (a) => `
      <div>
        <strong>Interessado:</strong> ${a.interessado} | 
        <strong>Pet:</strong> ${a.pet} | 
        <strong>Data:</strong> ${a.data}
      </div>`
    )
    .join("");

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Lista de Adoções</title>
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
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          background-color: #f8f9fa;
          margin: 10px auto;
          padding: 10px;
          border-radius: 5px;
          max-width: 400px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        a {
          text-decoration: none;
          color: #007bff;
          font-weight: bold;
          display: inline-block;
          margin-top: 15px;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <h1>Registro de Adoções</h1>
      <div>${listaHTML}</div>
      <a href="/adocao/lista">Voltar</a>
      <a href="/menu">Voltar ao Menu</a>
    </body>
    </html>
  `);
});

module.exports = router;

