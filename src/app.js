const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the user routes
app.use('/api', userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
