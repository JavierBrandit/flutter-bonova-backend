
/* 
    path: /api/usuarios
*/

const { Router } = require('express');
const { getUsuarios } = require('../contollers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios );



module.exports = router;