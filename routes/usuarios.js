
/* 
    path: /api/usuarios
*/

const { Router } = require('express');
const { getUsuarios } = require('../contollers/usuarios');
const { editar } = require('../contollers/auth_controller');
const { eliminar } = require('../contollers/auth_controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios ); // obtener usuarios

router.put('/:id', validarJWT, editar ), 
router.delete('/:id', validarJWT, eliminar ), 



module.exports = router;