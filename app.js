const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/auth");
const interessadosRoutes = require("./routes/interessados");
const petsRoutes = require("./routes/pets");
const adocaoRoutes = require("./routes/adocao");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "adocaoPetsSecret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 }, 
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRoutes);
app.use("/interessados", interessadosRoutes);
app.use("/pets", petsRoutes);
app.use("/adocao", adocaoRoutes);

function verificaAutenticacao(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect("/auth/login");
  }
  next();
}

app.get("/menu", verificaAutenticacao, (req, res) => {
  const usuario = req.session.usuario.email;

  const ultimoAcesso = req.cookies.ultimoAcesso
    ? req.cookies.ultimoAcesso
    : "Primeiro acesso";

  const agora = new Date().toLocaleString("pt-BR");
  res.cookie("ultimoAcesso", agora, { maxAge: 30 * 60 * 1000 }); 

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Menu do Sistema</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          margin: 0;
          padding: 0;
          text-align: center;
          color: #333;
        }
        h1 {
          margin: 20px 0;
          color: #444;
        }
        .menu {
          margin: 30px auto;
          max-width: 400px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
          background-color: #fff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .menu a {
          display: block;
          margin: 10px 0;
          padding: 10px;
          text-decoration: none;
          background-color: #007bff;
          color: white;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }
        .menu a:hover {
          background-color: #0056b3;
        }
        .logout {
          color: red;
          font-weight: bold;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <h1>Menu do Sistema</h1>
      <div class="menu">
        <p>Bem-vindo, <strong>${usuario}</strong>!</p>
        <p><strong>Último acesso:</strong> ${ultimoAcesso}</p>
        <a href="/interessados/cadastro">Cadastro de Interessados</a>
        <a href="/pets/cadastro">Cadastro de Pets</a>
        <a href="/adocao/lista">Adotar um Pet</a>
        <a href="/auth/logout" class="logout">Logout</a>
      </div>
    </body>
    </html>
  `);
});

app.get("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("ultimoAcesso"); 
    res.redirect("/auth/login");
  });
});

app.get("/", (req, res) => {
  res.redirect("/auth/login");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
