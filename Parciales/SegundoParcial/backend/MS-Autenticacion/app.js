import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { AppDataSource } from "./dataSource.js";
import { User } from "./user.js";
import { generarToken } from "./token.js";

dotenv.config();
const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => console.log("Conectado a la base de datos"))
  .catch((err) => console.error("Error al conectar a la BD:", err));


app.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password)
      return res.status(400).json({ message: "Email y contraseña requeridos" });

    const userRepo = AppDataSource.getRepository(User);
    const usuario = await userRepo.findOneBy({ correo });

    if (!usuario)
      return res.status(401).json({ message: "Usuario no encontrado" });

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = generarToken({ id: usuario.id, email: usuario.email });
    res.json({ message: "Login exitoso", token });
  } catch (err) {
    console.error("Error en /login:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
