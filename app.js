const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Acceso a rutas
const rutaJuego = require('./routes/juegos');

// Iniciar la app
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar "middleware" => "capa de comunicación"
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración de rutas
app.use('/', rutaJuego);  // Usar la ruta para manejar los juegos
// app.use('/api/categorias', rutaCategoria);  // Descomentar si tienes rutas para las categorías

// Servidor Web
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
