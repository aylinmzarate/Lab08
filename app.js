// Importación de módulos y configuración inicial
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env
const express = require('express'); // Importa Express.js para crear el servidor
const bodyParser = require('body-parser'); // Middleware para analizar cuerpos de solicitudes HTTP
const mongoose = require('mongoose'); // ORM para MongoDB
const usersRouter = require('./routes/users'); // Importa el enrutador de usuarios
const { body, validationResult } = require('express-validator'); // Funcionalidades de validación de Express
const bcrypt = require('bcrypt'); // Biblioteca para hashing de contraseñas

const app = express(); // Crea una instancia de la aplicación Express

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected!'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.set('view engine', 'ejs'); // Configura el motor de vistas como EJS
app.use(bodyParser.urlencoded({ extended: false })); // Utiliza el middleware body-parser
app.use('/users', usersRouter); // Utiliza el enrutador de usuarios para la ruta /users

// Ruta principal que redirige a /users
app.get('/', (req, res) => {
  res.redirect('/users');
});

// Inicia el servidor en el puerto especificado en las variables de entorno
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
