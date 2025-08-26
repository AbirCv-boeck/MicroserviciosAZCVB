const express = require("express");
const path = require("path");
const AppDataSource = require("./db");
const Agenda = require("./entidad/agenda");

const app = express();

// Configuración EJS y carpeta de CSS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "vistas"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "css")));

// Conectar a la BD
AppDataSource; // Ya se conecta automáticamente al requerir db.js

// Rutas
app.get("/", async (req, res) => {
    try {
        const agenda = await Agenda.find();
        res.render("index", { agenda });
    } catch (err) {
        console.error(err);
        res.send("Error al obtener contactos");
    }
});

app.get("/crear", (req, res) => {
    res.render("crear");
});

app.post("/crear", async (req, res) => {
    try {
        const nuevo = new Agenda({
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            fecha_nacimiento: new Date(req.body.fecha_nacimiento),
            direccion: req.body.direccion,
            celular: req.body.celular,
            correo: req.body.correo
        });
        await nuevo.save();
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error al guardar contacto");
    }
});

app.get("/editar/:id", async (req, res) => {
    try {
        const contacto = await Agenda.findById(req.params.id);
        res.render("editar", { contacto });
    } catch (err) {
        console.error(err);
        res.send("Error al obtener contacto");
    }
});

app.post("/editar/:id", async (req, res) => {
    try {
        await Agenda.findByIdAndUpdate(req.params.id, {
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            fecha_nacimiento: new Date(req.body.fecha_nacimiento),
            direccion: req.body.direccion,
            celular: req.body.celular,
            correo: req.body.correo
        });
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error al actualizar contacto");
    }
});

app.get("/eliminar/:id", async (req, res) => {
    try {
        await Agenda.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error al eliminar contacto");
    }
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
