const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const webapp_hostname = process.env.WEBAPP_HOSTNAME

// Middleware para habilitar CORS
app.use(cors());
app.use(cors({
  origin: `http://${webapp_hostname}`,
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  credentials: true
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
