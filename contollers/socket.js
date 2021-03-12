const Usuario = require('../models/usuario');
const Curso = require('../models/cursos');
const Mensaje = require('../models/mensaje');
const Historial = require('../models/historial');

const usuarioConectado = async ( uid = '' ) => {

    const usuario = await Usuario.findById( uid );
    usuario.online = true;

    await usuario.save();
    return usuario;
}

const usuarioDesconectado = async ( uid = '' ) => {

    const usuario = await Usuario.findById( uid );
    usuario.online = false;

    await usuario.save();
    return usuario;
}

const editar = async ( payload, uid = '' ) => {

    const usuario = await Usuario.findByIdAndUpdate(uid, payload, {new: true, runValidators: true});
    // usuario.profesor = true;

    await usuario.save();
    return usuario;
}

const grabarMensaje = async ( payload ) => {
    /*
        {
            de: '',
            para: '',
            texto: ''
        }
    */    
    try {
        const mensaje = new Mensaje( payload );
        await mensaje.save();
        
        return true;
    } catch (error) {
        return false; 
    }
}

const grabarHistorial = async ( payload, uid = '' ) => {
    /*
    {
        curso: '',
        progreso: 0.2,
    }
    */    
//    try {
//     //    const uid = req.uid;
//        const historial = new Historial( payload );
//        await historial.save();
       
//        return true;
//     } catch (error) {
//        return false; 
//     }
    let cid = payload.curso;
    // let payload = req.body;
    // let historial;
    // let currentUser;

    
    try {

        const existeHistorial = await Historial.findOne({ curso: cid });
        // const existeEmail = await Usuario.findOne({ email });
        if( existeHistorial ) {

            historial = await Historial.findOneAndUpdate({ curso: cid }, payload, {new: true} );

        } else {
            historial = new Historial( payload );
            await historial.save();        }
    
        // res.json({
        //     historial,
        // });
        
    } catch (error) {
        console.log(error);
        // res.status(500).json({
        //     ok: false,
        //     msg: 'Hable con el administrador'
        // });
    }
}

const guardarCursoSocket = async ( payload ) => {
    /*
        {
            curso: '',
            progeso: 0,1,
        }
    */ 
    // const usuario = await Usuario.findById( uid );
    // const historial = new Historial( payload );
    // const curso   = await Curso.findById( payload.curso );

    // await usuario.push(
    //     curso 
    // );
    // const existe = await Historial.findOneAndUpdate({curso: payload.curso})
    // const existe = await Historial.find({
    //     $or: [{ curso: payload.curso, usuario: payload.usuario }]
    // });
    // try {
    //     const existe = await Historial.findOneAndUpdate({
    //         $or: [{ curso: payload.curso, usuario: payload.usuario }]
    //     }, payload);
        
    // } catch (error) {
    //     const historial = new Historial( payload );
    //         await historial.save();
    //         return true;
    // }
    
    // try {
        // if (existe != []) {
        //     const historial = new Historial( payload );
        //     await historial.save();
        //     return true;
        // } else {
        //     return true;
        // } 
           
        // } catch (error) {
        //    return false; 
        // }
}




module.exports = {
    usuarioConectado,
    usuarioDesconectado,
    editar,
    grabarMensaje,
    grabarHistorial,
    guardarCursoSocket
}