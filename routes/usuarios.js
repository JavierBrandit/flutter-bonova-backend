
/* 
    path: /api/usuarios
*/

const { Router } = require('express');
const { getUsuarios } = require('../contollers/usuarios');
const { editar, guardarCurso, verGuardados, eliminarGuardado, agregarHistorial, borrarHistorial } = require('../contollers/auth_controller');
const { eliminar } = require('../contollers/auth_controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios ); // obtener usuarios

router.put('/:id', validarJWT, editar ), 
router.delete('/:id', validarJWT, eliminar ), 

router.get('/miscursos', validarJWT, verGuardados ), 
router.put('/miscursos/:cid', validarJWT, guardarCurso ), 
router.delete('/miscursos/:cid', validarJWT, eliminarGuardado ), 

// router.get('/historial', validarJWT, verHistorial ), 
// router.put('/historial/:cid', validarJWT, agregarHistorial ), 
// router.delete('/historial/:cid', validarJWT, borrarHistorial ), 


module.exports = router;