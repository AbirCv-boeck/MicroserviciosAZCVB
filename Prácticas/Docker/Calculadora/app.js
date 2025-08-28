const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Middleware para procesar formularios
app.use(express.urlencoded({ extended: true }));

// Servir archivo HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'vistas', 'index.html'));
});

// Ruta para procesar la calculadora
app.post('/calcular', (req, res) => {
  const { a, b, operacion } = req.body;
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  let resultado;

  switch (operacion) {
    case 'sumar':
      resultado = numA + numB;
      break;
    case 'restar':
      resultado = numA - numB;
      break;
    case 'multiplicar':
      resultado = numA * numB;
      break;
    case 'dividir':
      resultado = numB !== 0 ? numA / numB : 'Error: División por 0';
      break;
    default:
      resultado = 'Operación no válida';
  }

  res.send(`
    <h1>Resultado: ${resultado}</h1>
    <a href="/">Volver</a>
  `);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
