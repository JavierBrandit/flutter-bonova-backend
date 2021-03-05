
/* 
    path: /api/search
*/

const { Router } = require('express');
const { searchCursos } = require('../contollers/auth_controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// router.get('/search', validarJWT, searchCursos ), 

module.exports = router;