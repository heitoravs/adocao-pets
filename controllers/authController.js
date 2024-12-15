// controllers/authController.js
const login = (req, res) => {
  const { email, senha } = req.body;

  // Apenas exemplo de validação básica
  if (email === "admin@pets.com" && senha === "1234") {
    req.session.usuario = { email };
    res.redirect("/menu");
  } else {
    res.render("login", { error: "E-mail ou senha inválidos!" });
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/auth/login");
  });
};

module.exports = { login, logout };
