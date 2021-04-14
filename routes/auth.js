
/* 
    path: /api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, login, renewToken } = require('../contollers/auth_controller');
const { googleAuth } = require('../contollers/auth_google');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.post('/new', [
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    check('email', 'El email es Obligatorio').isEmail(),
    check('password', 'El password es Obligatorio').not().isEmpty(),
    validarCampos

], crearUsuario);

router.post('/', [
    check('email', 'El email es Obligatorio').isEmail(),
    check('password', 'El password es Obligatorio').not().isEmpty(),
], login );

// Validar JWT
router.get('/renew', validarJWT, renewToken );

router.post('/google', googleAuth );


module.exports = router;