
/* 
    path: /api/curso
*/

const { Router } = require('express');
const { obtenerCursos, postearCursos, getMatematica, editar } = require('../contollers/cursos');
const { obtenerHistorial } = require('../contollers/mensajes');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, obtenerCursos );
router.get('/:ramo/:nivel', validarJWT, getMatematica );
router.post('/post', validarJWT, postearCursos );
router.put('/:id', validarJWT, editar ), 

router.get('/historial/', validarJWT, obtenerHistorial );

module.exports = router;