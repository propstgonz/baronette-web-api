const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const webapp_hostname = process.env.WEBAPP_HOSTNAME;

// Middleware para habilitar CORS
app.use(cors({
  origin: '*',  // Permitir cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],  // Permitir múltiples métodos
  allowedHeaders: ['*'],  // Permitir todos los encabezados
}));


// Middleware para parsear el contenido de los JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas de usuario
app.use('/api', userRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
