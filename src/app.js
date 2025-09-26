const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Para que Traefik detecte la API
app.get('/health', (req, res) => res.send('OK'));

// Para que la API salude
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

// Middleware CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['*'],
}));

// Middleware para parsear JSON y urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// **Rutas de usuario directamente en la raíz**
app.use('/', userRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error('Error general:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`API listening on port ${port}`);
});

