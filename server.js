import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

// 🔗 Conexão com MongoDB usando variável de ambiente
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB conectado"))
.catch(err => console.error("❌ Erro ao conectar no MongoDB:", err));

// 🛠 Modelo simples de usuário (exemplo)
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model("User", userSchema);

// 🔑 Rota de registro
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = new User({ username, password });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Usuário registrado com sucesso", token });
  } catch (err) {
    res.status(500).json({ message: "Erro ao registrar usuário", error: err });
  }
});

// 🔑 Rota de login
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ message: "Credenciais inválidas" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login realizado com sucesso", token });
  } catch (err) {
    res.status(500).json({ message: "Erro ao fazer login", error: err });
  }
});

// 🔒 Middleware de autenticação
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Token não fornecido" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido" });
  }
}

// 🔒 Rota protegida
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Acesso autorizado!", user: req.user });
});

// 🚀 Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

