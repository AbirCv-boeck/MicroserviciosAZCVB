// index.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { getPoolWithRetry, config } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

(async () => {
  try {
    const pool = await getPoolWithRetry();

    // Crear base de datos (si no existe) — en entornos Docker la DB será creada por MySQL pero por seguridad:
    // NOTA: Si no tienes permisos para crear BD con el usuario, esta sección puede fallar; la compose crea la DB.
    try {
      const conn = await pool.getConnection();
      await conn.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
      conn.release();
    } catch (e) {
      // ignorar si no tiene permiso de crear DB
    }

    // Crear tabla users si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(200) NOT NULL,
        correo VARCHAR(200) NOT NULL UNIQUE,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Rutas
    app.get('/', async (req, res) => {
      const [rows] = await pool.query('SELECT id, nombre, correo, fecha_registro FROM users ORDER BY id DESC');
      res.render('index', { users: rows });
    });

    app.get('/nuevo', (req, res) => {
      res.render('new', { error: null, old: {} });
    });

    app.post('/usuarios', async (req, res) => {
      const { nombre, correo } = req.body;
      if (!nombre || !correo) {
        return res.render('new', { error: 'Nombre y correo son requeridos', old: { nombre, correo } });
      }
      try {
        await pool.query('INSERT INTO users (nombre, correo) VALUES (?, ?)', [nombre, correo]);
        res.redirect('/');
      } catch (err) {
        let error = 'Error al guardar usuario';
        if (err.code === 'ER_DUP_ENTRY') error = 'El correo ya está registrado';
        res.render('new', { error, old: { nombre, correo } });
      }
    });

    app.post('/usuarios/:id/eliminar', async (req, res) => {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).send('ID inválido');
      await pool.query('DELETE FROM users WHERE id = ?', [id]);
      res.redirect('/');
    });

    app.listen(PORT, () => {
      console.log(`App corriendo en http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Error iniciando la app:', err);
    process.exit(1);
  }
})();
