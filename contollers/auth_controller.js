const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const Curso = require('../models/cursos');
const Historial = require('../models/historial');
const { generarJWT } = require('../helpers/jwt');
const cursos = require('../models/cursos');

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

// HISTORIAL
const agregarHistorial = async ( req, res = response, next ) => {

    let uid = req.uid;
    let cid = req.params.cid;
    let currentUser;

    Usuario.findById(uid)
    .populate('historial')
    .then((user) => {
      currentUser = user;
      return Curso.findById(cid);
    })
    .then((movie) => {
      let isExist = false;
      currentUser.historial.map((item) => {
        // if (item.curso.cid.toString() === cid.toString()) {
        //   isExist = true;
        // }
      });
      if (!isExist) {
        currentUser.historial.push({
            curso: movie,
            progreso: 0.0,
            // fecha: Date
        });
      }
      return currentUser.save();
    })
    .then((result) => {
      res.status(200).json(result.historial);
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}
// const agregarHistorial = async ( req, res = response, next ) => {

//     let uid = req.uid;
//     let cid = req.params.cid;
//     let currentUser;
//     let hid;

//     // const { email, password } = req.body;
    
//     try {
//         currentUser = await Usuario.findById({ uid });
//         if ( !usuarioDB ) {
//             return res.status(404).json({
//                ok: false,
//                msg: 'Usuario no encontrado' 
//             });
//         }
//         const curso = await Curso.findById({ cid });
//         if ( !curso ) {
//             return res.status(404).json({
//                ok: false,
//                msg: 'Curso no encontrado' 
//             });
//         }
//         const historial = await Historial.findOne({ cid });
//         if ( !historial ) {
//             return res.status(404).json({
//                ok: false,
//                msg: 'Curso no encontrado' 
//             });
//         }

//         // Validar el passwors
//         // const validPassword = bcrypt.compareSync( password, usuarioDB.password );
//         // if ( !validPassword ) {
//         //     return res.status(400).json({
//         //         ok: false,
//         //         msg: 'Password no encontrado' 
//         //      });
//         // }

//         //Generar el JWT
//         // const token = await generarJWT( usuarioDB.id );

//         res.json({
//             ok: true,
//             historial: historial,
//             // token
//         });
        
//     } catch (error) {
//         return res.status(500).json({
//             ok: false,
//             msg: 'Hable con el administrador'
//         })
//     }
    
// }


// const editar = async ( req, res = response ) => {

//     let id = req.params.uid;
//     let body = req.body 
    
//     Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, userBD) => {
//         if(err){
//             return res.status(400).json({
//                ok: false,
//                err  
//             });
//         }

//         res.json({
//             ok: true,
//             usuario: userBD
//         })
//     });
// }


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

// const searchCursos = async ( req, res = response ) => {

//     const uid = req.uid;
//     let query = req.params.query;

//     const cursos = await Curso.find({ titulo: query });

//     // const respuesta = cursos.getFilter();

//     res.json({
//         cursos,
//         query
//     });
// }
const searchCursos = async ( req, res = response ) => {

    // const uid = req.uid;
    let query = req.query.t;
    let cursos;

   
    cursos = await Curso.find({
        $text: {
            $search: query
        }},
        {
            score: { $meta: 'textScore' }
        }
    ).sort({
        score: { $meta: 'textScore'}
    });
    

    // const cursos = await Curso.find({ titulo: query });

    // const respuesta = cursos.getFilter();

    res.json({
        cursos,
        query
    });

    // function(req, res, next) {
    //     Product.find({ $text: { $search: req.param('title') } } , function(err, docs){
    //        res.render('shop/search', {products: docs} );
    //     });
    //   }
}

module.exports = {
    crearUsuario,
    login,
    editar,
    eliminar,
    renewToken,
    guardarCurso,
    verGuardados,
    eliminarGuardado,
    agregarHistorial,
    // borrarHistorial,
    searchCursos
}