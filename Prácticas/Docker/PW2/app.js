const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const connectDB = require('./db');
const Tarea = require('./models/Tarea');

const app = express();
const PORT = 3000;

// Conectar a MongoDB
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Rutas

// Mostrar todas las tareas
app.get('/', async (req, res) => {
    const tareas = await Tarea.find().sort({ fechaCreacion: -1 });
    res.render('index', { tareas });
});

// Agregar nueva tarea
app.post('/add', async (req, res) => {
    const { titulo, descripcion } = req.body;
    await Tarea.create({ titulo, descripcion });
    res.redirect('/');
});

// Actualizar estado
app.post('/update/:id', async (req, res) => {
    const { estado } = req.body;
    await Tarea.findByIdAndUpdate(req.params.id, { estado });
    res.redirect('/');
});

// Eliminar tarea
app.post('/delete/:id', async (req, res) => {
    await Tarea.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`App corriendo en http://localhost:${PORT}`);
});
