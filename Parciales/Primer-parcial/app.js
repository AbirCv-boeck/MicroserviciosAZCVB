const express = require("express");
const path = require("path");
require("reflect-metadata");
const AppDataSource = require("./bd");
const Medico = require("./entity/medico");


const app = express();

app.use(express.urlencoded({ extended: true }));


AppDataSource.initialize()
    .then(() => console.log("Conexión a la BD con TypeORM lista"))
    .catch(err => console.error(err));

//Rutas
app.get("/", async (req, res) => {
    const repo = AppDataSource.getRepository("Medico");
    const medico = await repo.find();
    res.render("index", { medico });
});

app.get("/crear", (req, res) => {
    res.render("crear");
});

app.post("/crear", async (req, res) => {
    const repo = AppDataSource.getRepository("Medico");
    await repo.save(req.body);
    res.redirect("/");
});

app.get("/editar/:id", async (req, res) => {
    const repo = AppDataSource.getRepository("Medico");
    const medico = await repo.findOneBy({ id: parseInt(req.params.id) });
    res.render("editar", { medico });
});

app.post("/editar/:id", async (req, res) => {
    const repo = AppDataSource.getRepository("Medico");
    await repo.update(req.params.id, req.body);
    res.redirect("/");
});

app.get("/eliminar/:id", async (req, res) => {
    const repo = AppDataSource.getRepository("Medico");
    await repo.delete(req.params.id);
    res.redirect("/");
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));