const express = require('express')
const router = express.Router()
const db = require('../config/database')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Directorio donde se guardarán las imágenes
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    // Generar un nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = path.extname(file.originalname)
    cb(null, 'game-' + uniqueSuffix + extension)
  }
})

// Filtro para solo permitir imágenes
const fileFilter = (req, file, cb) => {
  // Comprobar que el tipo de archivo es una imagen
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('El archivo debe ser una imagen (jpg, png, gif)'), false)
  }
}

// Configuración de Multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // límite de 5MB
  }
})

//  Mostrar todos los juegos
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        j.idjuego,
        j.nomjuego,
        j.precio,
        j.clasificacion,
        j.descripcion,
        j.editor,
        j.referenciaimg,
        c.nomcategoria AS categoria,
        p.nomplataforma AS plataforma
      FROM juegos j
      JOIN categoria c ON j.idcategoria = c.idcategoria
      JOIN plataformas p ON j.idplataforma = p.idplataforma
    `
    const [juegos] = await db.query(query)
    res.render('index', { juegos, path: '/' })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al cargar los juegos')
  }
})

//  Formulario para crear nuevo juego
router.get('/create', async (req, res) => {
  try {
    const [categorias] = await db.query('SELECT * FROM categoria')
    const [plataformas] = await db.query('SELECT * FROM plataformas')
    res.render('create', { categorias, plataformas, path: '/create' })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al cargar el formulario')
  }
})

//  Guardar nuevo juego con imagen
router.post('/create', upload.single('imagen'), async (req, res) => {
  try {
    const { nomjuego, precio, clasificacion, descripcion, editor, idcategoria, idplataforma } = req.body
    
    // Obtener la ruta de la imagen si se subió una, o null si no
    const referenciaimg = req.file ? `/uploads/${req.file.filename}` : null
    
    await db.query(
      `INSERT INTO juegos (nomjuego, precio, clasificacion, descripcion, editor, referenciaimg, idcategoria, idplataforma)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nomjuego, precio, clasificacion, descripcion, editor, referenciaimg, idcategoria, idplataforma]
    )
    res.redirect('/')
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al crear el juego')
  }
})

//  Formulario de edición
router.get('/edit/:id', async (req, res) => {
  try {
    const [categorias] = await db.query('SELECT * FROM categoria')
    const [plataformas] = await db.query('SELECT * FROM plataformas')
    const [registro] = await db.query('SELECT * FROM juegos WHERE idjuego = ?', [req.params.id])

    if (registro.length > 0)
      res.render('edit', { juego: registro[0], categorias, plataformas, path: '/edit' })
    else
      res.redirect('/')
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al cargar el formulario de edición')
  }
})

//  Guardar edición con imagen
router.post('/edit/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { nomjuego, precio, clasificacion, descripcion, editor, idcategoria, idplataforma } = req.body
    
    // Si hay un archivo nuevo, usarlo; si no, mantener la referencia existente
    let referenciaimg
    
    if (req.file) {
      referenciaimg = `/uploads/${req.file.filename}`
      
      // Opcionalmente: eliminar la imagen anterior si existe
      const [juegoAnterior] = await db.query('SELECT referenciaimg FROM juegos WHERE idjuego = ?', [req.params.id])
      if (juegoAnterior.length > 0 && juegoAnterior[0].referenciaimg) {
        const rutaAnterior = path.join(__dirname, '..', 'public', juegoAnterior[0].referenciaimg)
        // Verificar si el archivo existe antes de intentar eliminarlo
        if (fs.existsSync(rutaAnterior)) {
          fs.unlinkSync(rutaAnterior)
        }
      }
    } else {
      // Mantener la imagen existente
      const [juegoActual] = await db.query('SELECT referenciaimg FROM juegos WHERE idjuego = ?', [req.params.id])
      referenciaimg = juegoActual[0].referenciaimg
    }
    
    await db.query(
      `UPDATE juegos SET nomjuego=?, precio=?, clasificacion=?, descripcion=?, editor=?, referenciaimg=?, idcategoria=?, idplataforma=?
       WHERE idjuego=?`,
      [nomjuego, precio, clasificacion, descripcion, editor, referenciaimg, idcategoria, idplataforma, req.params.id]
    )
    res.redirect('/')
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al actualizar el juego')
  }
})

//  Eliminar juego
router.get('/delete/:id', async (req, res) => {
  try {
    // Obtener información del juego para eliminar también la imagen
    const [juego] = await db.query('SELECT referenciaimg FROM juegos WHERE idjuego = ?', [req.params.id])
    
    // Eliminar el juego de la base de datos
    await db.query('DELETE FROM juegos WHERE idjuego = ?', [req.params.id])
    
    // Si el juego tenía una imagen, eliminarla del sistema de archivos
    if (juego.length > 0 && juego[0].referenciaimg) {
      const rutaImagen = path.join(__dirname, '..', 'public', juego[0].referenciaimg)
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen)
      }
    }
    
    res.redirect('/')
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al eliminar el juego')
  }
})

//Ruta para ver el catálogo de juegos
// Esta ruta permite filtrar por categoría, orden y búsqueda
// y renderiza la vista del catálogo con los resultados obtenidos.
router.get('/catalogo', async (req, res) => {
  try {
    // Obtener filtros de la URL
    const { categoria, orden, busqueda } = req.query;
    
    // Consulta base
    let query = `
      SELECT 
        j.idjuego,
        j.nomjuego,
        j.precio,
        j.clasificacion,
        j.descripcion,
        j.editor,
        j.referenciaimg,
        c.idcategoria,
        c.nomcategoria AS categoria,
        p.nomplataforma AS plataforma
      FROM juegos j
      JOIN categoria c ON j.idcategoria = c.idcategoria
      JOIN plataformas p ON j.idplataforma = p.idplataforma
      WHERE 1=1
    `;
    
    // Parámetros para la consulta
    const params = [];
    
    // Aplicar filtro de categoría
    if (categoria && categoria !== 'todas') {
      query += ' AND j.idcategoria = ?';
      params.push(categoria);
    }
    
    // Aplicar filtro de búsqueda
    if (busqueda && busqueda.trim() !== '') {
      const terminoBusqueda = `%${busqueda.trim()}%`;
      query += ' AND (j.nomjuego LIKE ? OR j.editor LIKE ? OR j.descripcion LIKE ?)';
      params.push(terminoBusqueda, terminoBusqueda, terminoBusqueda);
    }
    
    // Aplicar orden
    if (orden === 'precio_desc') {
      query += ' ORDER BY j.precio DESC';
    } else if (orden === 'precio_asc') {
      query += ' ORDER BY j.precio ASC';
    } else if (orden === 'nombre_asc') {
      query += ' ORDER BY j.nomjuego ASC';
    } else if (orden === 'nombre_desc') {
      query += ' ORDER BY j.nomjuego DESC';
    } else {
      // Orden por defecto
      query += ' ORDER BY j.idjuego DESC';
    }
    
    // Ejecutar consulta
    const [juegos] = await db.query(query, params);
    
    // Obtener todas las categorías para el filtro
    const [categorias] = await db.query('SELECT * FROM categoria');
    
    // Renderizar vista
    res.render('catalogo', { 
      juegos, 
      categorias, 
      filtros: {
        categoria: categoria || 'todas',
        orden: orden || 'recientes',
        busqueda: busqueda || ''
      },
      path: '/catalogo'
    });
    
  } catch (error) {
    console.error('Error al cargar el catálogo:', error);
    res.status(500).send('Error al cargar el catálogo de juegos');
  }
});

// Manejo de errores de Multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Error de Multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send('El archivo es demasiado grande (máximo 5MB)')
    }
    return res.status(400).send('Error al subir el archivo: ' + err.message)
  } else if (err) {
    // Otro tipo de error
    return res.status(500).send(err.message)
  }
  next()
})

module.exports = router