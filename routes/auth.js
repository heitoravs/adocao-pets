const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/login", (req, res) => {
  if (req.session.usuario) {
    return res.redirect("/menu");
  }

  res.sendFile(path.join(__dirname, "../views/login.html")); 
});

router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (email === "unoesteADS@hotmail.com" && senha === "1234") {
    req.session.usuario = { email }; 
    res.cookie("ultimoAcesso", new Date().toLocaleString()); 
    res.redirect("/menu"); 
  } else {
    res.send(`
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <title>Login</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f8f9fa;
          }
          .container {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
          }
          h1 {
            margin-bottom: 15px;
            color: #333;
          }
          .error {
            color: red;
            margin-bottom: 15px;
          }
          a {
            text-decoration: none;
            color: #007bff;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Login</h1>
          <p class="error">Usuário ou senha inválidos!</p>
          <a href="/auth/login">Tentar novamente</a>
        </div>
      </body>
      </html>
    `);
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/auth/login");
  });
});

module.exports = router;
