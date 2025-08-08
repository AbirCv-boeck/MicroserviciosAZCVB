const express = require('express');
const path = require('path');
const conexion = require('./db');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'vistas'));
app.use('/css', express.static(path.join(__dirname, 'css')));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  conexion.query('SELECT * FROM agenda', (err, resultados) => {
    if (err) throw err;
    res.render('index', { agenda: resultados });
  });
});

app.get('/crear', (req, res) => {
  res.render('crear');
});

app.post('/guardar', (req, res) => {
  const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
  conexion.query('INSERT INTO agenda SET ?', {
    nombres,
    apellidos,
    fecha_nacimiento,
    direccion,
    celular,
    correo
  }, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.get('/editar/:id', (req, res) => {
  const id = req.params.id;
  conexion.query('SELECT * FROM agenda WHERE id = ?', [id], (err, resultados) => {
    if (err) throw err;
    res.render('editar', { contacto: resultados[0] });
  });
});

app.post('/actualizar/:id', (req, res) => {
  const id = req.params.id;
  const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
  conexion.query('UPDATE agenda SET ? WHERE id = ?', [{
    nombres,
    apellidos,
    fecha_nacimiento,
    direccion,
    celular,
    correo
  }, id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.get('/eliminar/:id', (req, res) => {
  const id = req.params.id;
  conexion.query('DELETE FROM agenda WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor ejecutándose en http://localhost:3000');
});
