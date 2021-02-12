const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response ) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });
        if( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            })
        }

        const usuario = new Usuario( req.body );

        // Encriptar contraseñas
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        // Generar mi JWT
        const token = await generarJWT( usuario.id );
    
        res.json({
            ok: true,
            usuario,
            token
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
}

const login = async ( req, res = response ) => {

    const { email, password } = req.body;
    
    try {
        const usuarioDB = await Usuario.findOne({ email });
        if ( !usuarioDB ) {
            return res.status(404).json({
               ok: false,
               msg: 'Email no encontrado' 
            });
        }

        // Validar el passwors
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password no encontrado' 
             });
        }

        //Generar el JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    
}


const editar = async ( req, res = response ) => {

    let id = req.params.id;
    let body = req.body 
    
    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, userBD) => {
        if(err){
            return res.status(400).json({
               ok: false,
               err  
            });
        }

        res.json({
            ok: true,
            usuario: userBD
        })
    });
}

const eliminar = async ( req, res = response ) => {

    let id = req.params.uid;
    User.findByIdAndUpdate(id, {status: false}, {new: true}, (err, userBD) => {
        if(err){
            return res.status(400).json({
               ok: false,
               err  
            });
        }

        if(!userBD){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario no encontrado'
                } 
             });
        }

        res.json({
            ok: true,
            userBD
        });
    });
}


const renewToken = async ( req, res = response ) => {
   
    const uid = req.uid;

    // generar un nuevo JWT
    const token = await generarJWT( uid );

    //Obtener el usuario por UID
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        usuario,
        token
    });
}

module.exports = {
    crearUsuario,
    login,
    editar,
    eliminar,
    renewToken
}