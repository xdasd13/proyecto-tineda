const express = require('express')
const router = express.Router()
const db = require('../config/database')

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
    res.render('index', { juegos })
  } catch (error) {
    console.error(error)
  }
})

//  Formulario para crear nuevo juego
router.get('/create', async (req, res) => {
  try {
    const [categorias] = await db.query('SELECT * FROM categoria')
    const [plataformas] = await db.query('SELECT * FROM plataformas')
    res.render('create', { categorias, plataformas })
  } catch (error) {
    console.error(error)
  }
})

//  Guardar nuevo juego
router.post('/create', async (req, res) => {
  try {
    const { nomjuego, precio, clasificacion, descripcion, editor, referenciaimg, idcategoria, idplataforma } = req.body
    await db.query(
      `INSERT INTO juegos (nomjuego, precio, clasificacion, descripcion, editor, referenciaimg, idcategoria, idplataforma)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nomjuego, precio, clasificacion, descripcion, editor, referenciaimg, idcategoria, idplataforma]
    )
    res.redirect('/')
  } catch (error) {
    console.error(error)
  }
})

//  Formulario de edición
router.get('/edit/:id', async (req, res) => {
  try {
    const [categorias] = await db.query('SELECT * FROM categoria')
    const [plataformas] = await db.query('SELECT * FROM plataformas')
    const [registro] = await db.query('SELECT * FROM juegos WHERE idjuego = ?', [req.params.id])

    if (registro.length > 0)
      res.render('edit', { juego: registro[0], categorias, plataformas })
    else
      res.redirect('/')
  } catch (error) {
    console.error(error)
  }
})

//  Guardar edición
router.post('/edit/:id', async (req, res) => {
  try {
    const { nomjuego, precio, clasificacion, descripcion, editor, referenciaimg, idcategoria, idplataforma } = req.body
    await db.query(
      `UPDATE juegos SET nomjuego=?, precio=?, clasificacion=?, descripcion=?, editor=?, referenciaimg=?, idcategoria=?, idplataforma=?
       WHERE idjuego=?`,
      [nomjuego, precio, clasificacion, descripcion, editor, referenciaimg, idcategoria, idplataforma, req.params.id]
    )
    res.redirect('/')
  } catch (error) {
    console.error(error)
  }
})

//  Eliminar juego
router.get('/delete/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM juegos WHERE idjuego = ?', [req.params.id])
    res.redirect('/')
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
