const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'agenda_db',
  port: 3307
});

conexion.connect((err) => {
  if (err) {
    console.error('Error al conectar la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

module.exports = conexion;
