// Importación de módulos y configuración inicial
const express = require('express'); // Importa Express.js para crear el enrutador
const mongoose = require('mongoose'); // Importa Mongoose para interactuar con MongoDB
const { body, validationResult } = require('express-validator'); // Importa express-validator para validar los datos de entrada
const bcrypt = require('bcrypt'); // Importa la biblioteca bcrypt para el hashing de contraseñas

const router = express.Router(); // Crea un nuevo enrutador utilizando Express

// Definición del esquema de usuario utilizando Mongoose
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

// Creación del modelo de usuario utilizando el esquema definido
const User = mongoose.model('User', userSchema);

// Ruta para obtener todos los usuarios y renderizarlos en una vista
router.get('/', async (req, res) => {
  const users = await User.find();
  res.render('index', { users });
});

// Ruta para crear un nuevo usuario
router.post('/', [
  // Validación de los campos del formulario utilizando express-validator
  body('name').notEmpty().withMessage('El nombre es obligatorio').isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  body('email').notEmpty().withMessage('El email es obligatorio').isEmail().withMessage('El email debe tener un formato válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
  const errors = validationResult(req); // Obtiene los errores de validación
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Si hay errores, devuelve un mensaje de error
  }

  try {
    // Hashing de la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Creación de un nuevo usuario con los datos proporcionados por el usuario
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    // Guarda el nuevo usuario en la base de datos
    await newUser.save();
    res.redirect('/users'); // Redirige al usuario a la página de usuarios
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Error creating user'); // Si hay un error, devuelve un mensaje de error
  }
});

// Ruta para obtener un usuario específico y renderizar un formulario de edición
router.get('/edit/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render('partials/edit', { user });
});

// Ruta para actualizar un usuario específico
router.post('/update/:id', async (req, res) => {
  try {
    // Actualiza los datos del usuario en la base de datos utilizando el ID proporcionado
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/users'); // Redirige al usuario a la página de usuarios
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Error updating user'); // Si hay un error, devuelve un mensaje de error
  }
});

// Ruta para eliminar un usuario específico
router.get('/delete/:id', async (req, res) => {
  try {
    // Elimina un usuario de la base de datos utilizando el ID proporcionado
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users'); // Redirige al usuario a la página de usuarios
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user'); // Si hay un error, devuelve un mensaje de error
  }
});

module.exports = router; // Exporta el enrutador para ser utilizado en otros módulos de la aplicación
