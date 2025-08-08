const express = require("express");
const path = require("path");
require("reflect-metadata");
const AppDataSource = require("./db");
const Agenda = require("./entidades/Agenda");


const app = express();

// Configuración EJS y carpeta de CSS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "vistas"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "css")));

// Conectar a la BD
AppDataSource.initialize()
    .then(() => console.log("Conexión a la BD con TypeORM lista"))
    .catch(err => console.error(err));

// Rutas
app.get("/", async (req, res) => {
    const repo = AppDataSource.getRepository("Agenda");
    const agenda = await repo.find();
    res.render("index", { agenda });
});

app.get("/crear", (req, res) => {
    res.render("crear");
});

app.post("/crear", async (req, res) => {
    const repo = AppDataSource.getRepository("Agenda");
    await repo.save(req.body);
    res.redirect("/");
});

app.get("/editar/:id", async (req, res) => {
    const repo = AppDataSource.getRepository("Agenda");
    const contacto = await repo.findOneBy({ id: parseInt(req.params.id) });
    res.render("editar", { contacto });
});

app.post("/editar/:id", async (req, res) => {
    const repo = AppDataSource.getRepository("Agenda");
    await repo.update(req.params.id, req.body);
    res.redirect("/");
});

app.get("/eliminar/:id", async (req, res) => {
    const repo = AppDataSource.getRepository("Agenda");
    await repo.delete(req.params.id);
    res.redirect("/");
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));