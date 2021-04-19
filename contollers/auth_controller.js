const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const Curso = require('../models/cursos');
const Historial = require('../models/historial');
const { generarJWT } = require('../helpers/jwt');
// const cursos = require('../models/cursos');
// const usuario = require('../models/usuario');

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

const verHistorial = async ( req, res = response ) => {

    let uid = req.uid;

    
    try {
        
        const historial = await Historial.find({ usuario: uid })
            .sort('-updatedAt')
            .populate({
                path: 'curso',
                populate: { path: 'profesor' }
              });
    
        res.json({
            historial,
        });
        
    } catch (error) {
        console.log(error);
    }
    
}

const editar = async ( req, res = response ) => {

    let id = req.params.uid;
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

const guardarCurso = async ( req, res = response ) => {

    let uid = req.uid;
    let cid = req.params.cid;
    let currentUser;

    Usuario.findById(uid)
    .populate('guardados')
    .then((user) => {
      currentUser = user;
      return Curso.findById(cid);
    })
    .then((movie) => {
      let isExist = false;
      currentUser.guardados.map((item) => {
        if (item._id.toString() === cid.toString()) {
          isExist = true;
        }
      });
      if (!isExist) {
        currentUser.guardados.push(movie);
      }
      return currentUser.save();
    })
    .then((result) => {
      res.status(200).json(result.guardados);
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

const guardarHistorial = async ( req, res = response ) => {

    let uid = req.uid;
    let cid = req.params.cid;
    let payload = req.body;
    let historial;

    
    try {

        const existeHistorial = await Historial.findOne({ curso: cid });
        // const existeEmail = await Usuario.findOne({ email });
        if( existeHistorial ) {

            historial = await Historial.findOneAndUpdate({ curso: cid }, payload, {new: true} );

        } else {
            historial = new Historial( payload );
            await historial.save();
        }

    
        res.json({
            historial,
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
}

const verGuardados = async ( req, res = response ) => {
    
    const userId = req.uid;
    Usuario.findById(userId)
      .populate('guardados')
      .then((movies) => {
        res.json(movies.guardados);
      })
      .catch((err) => {
        console.log(err);
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
}

const eliminarGuardado = async ( req, res = response ) => {
    
  const userId = req.uid;
  const movieId = req.params.cid;
  
  Usuario.findById(userId)
    .populate('guardados')
    .then((user) => {
      user.guardados.remove(movieId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json(result.guardados);
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

const eliminar = async ( req, res = response ) => {

    let id = req.params.uid;
    Usuario.findByIdAndUpdate(id, {status: false}, {new: true}, (err, userBD) => {
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

const searchCursos = async ( req, res = response ) => {

    const uid = req.uid;
    let query = req.query.t;
    let cursos;
    var element = [];
    var final = [];

    
    
    cursos = await Curso.find({
        $text: {
            $search: query
        }},
        {
            score: { $meta: 'textScore' }
        }
        )
        .populate({
            path: 'profesor',
        })
        .sort({
            score: { $meta: 'textScore'}
        });

        function name(c) {
        
            for ( i in c) {
               if (Object.hasOwnProperty.call(c, i)) {
                   element.push(c[i]._id);
                   i+=1;   
               }
           }
           return element;
        }

        const n = name(cursos);
        
        var hh = await Historial.find( { curso: { $in: element }, usuario: uid } )
                                .populate({
                                    path: 'curso',
                                    populate: { path: 'profesor' }
                                });

        function histoID(historial) {
        
        for (var i in historial) {
           if (Object.hasOwnProperty.call(historial, i)) {
               final.push(historial[i].curso);
               i+=1;   
           }
       }
       return final;
    }

    const f = histoID(hh);

    const curs = await Curso.find({
        _id: { $nin: f },
        $text: {
            $search: query
        }},
        {
            score: { $meta: 'textScore' }
        }
        )
        .populate({
            path: 'profesor',
        })
        .sort({
            score: { $meta: 'textScore'}
        });

    function cursosRestantes(curso) {
        
        for (var i in curso) {
           if (Object.hasOwnProperty.call(curso, i)) {

               hh.push({
                   curso: curso[i],
                   usuario: uid
               });
               i+=1;   
           }
       }
       return hh;
    }

    const historial = cursosRestantes(curs);


    res.json({
        historial,
    });
}

module.exports = {
    crearUsuario,
    login,
    editar,
    eliminar,
    renewToken,
    guardarCurso,
    verGuardados,
    verHistorial,
    eliminarGuardado,
    guardarHistorial,
    searchCursos
}