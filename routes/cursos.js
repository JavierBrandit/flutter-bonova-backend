
/* 
    path: /api/curso
*/

const { Router } = require('express');
const { obtenerCursos, postearCursos, getMatematica } = require('../contollers/cursos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, obtenerCursos );
router.get('/:ramo/:nivel', validarJWT, getMatematica );
router.post('/post', validarJWT, postearCursos );



module.exports = router;