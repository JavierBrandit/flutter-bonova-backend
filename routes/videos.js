
/* 
    path: /api/video
*/

const { Router } = require('express');
const { obtenerVideos, postearVideos } = require('../contollers/videos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, obtenerVideos );
router.post('/post', validarJWT, postearVideos );



module.exports = router;