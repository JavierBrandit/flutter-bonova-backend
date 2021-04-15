const { response } = require('express');
const bcrypt = require('bcryptjs');
const { validarGoogleIdToken } = require('../helpers/google-verify-token');


const googleAuth = async ( req, res = response ) => {

    const token = req.body.token;
    
    console.log('============ token ============= ');
    console.log(token);
    if( token === null ) {
        return res.json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }
    
    const googleUser = await validarGoogleIdToken( token );
    console.log('============ google user ============= ');
    console.log(googleUser);
    console.log('============ req.body ============= ');
    console.log(req.body);
    
    if ( googleUser === null ) {
        return res.status(400).json({
            ok: false
        });
    }

    // const usuario = new Usuario( req.body );

    // // Encriptar contraseñas
    // const salt = bcrypt.genSaltSync();
    // usuario.password = bcrypt.hashSync( password, salt );

    // await usuario.save();

    // TODO: Guardar en su base de datos


    res.json({
        ok: true,
        googleUser
    });


}



module.exports = {
    googleAuth
}