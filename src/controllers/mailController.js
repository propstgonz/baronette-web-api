// controllers/mailController.js
const mailboxModel = require('../models/mailboxModel');

const registerMail = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  try {
    const mailbox = await mailboxModel.registerMailbox(email, password);
    return res.status(201).json({ message: 'Correo registrado con éxito', mailbox });
  } catch (error) {
    // Loguea la stack completa para depuración
    console.error('Error registrando correo:', error && error.stack ? error.stack : error);

    // Respuestas útiles según el error
    if (error.code === '23505') { // unique_violation Postgres
      return res.status(409).json({ message: 'El email ya existe' });
    }
    if (error.code === 'INVALID_EMAIL') {
      return res.status(400).json({ message: 'Email inválido' });
    }

    return res.status(500).json({ message: 'Error en el servidor al registrar correo' });
  }
};

module.exports = { registerMail };
