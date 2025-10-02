const mailboxModel = require('../models/mailboxModel');

/**
 * Registro de correo
 */
const registerMail = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  try {
    await mailboxModel.registerMailbox(email, password);
    res.status(201).json({ message: 'Correo registrado con éxito' });
  } catch (error) {
    console.error('Error registrando correo:', error.message);
    res.status(500).json({ message: 'Error en el servidor al registrar correo' });
  }
};

module.exports = {
  registerMail,
};
