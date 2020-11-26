
/* 
    path: /api/curso
*/

const { Router } = require('express');
const { obtenerCursos, postearCursos } = require('../contollers/cursos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, obtenerCursos );
router.post('/post', validarJWT, postearCursos );



module.exports = router;