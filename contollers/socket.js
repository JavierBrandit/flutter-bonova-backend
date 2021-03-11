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

const grabarHistorial = async ( payload ) => {
    /*
    {
        curso: '',
        progreso: 0.2,
    }
    */    
   try {
    //    const uid = req.uid;
       const historial = new Historial( payload );
       await historial.save();
       
       return true;
    } catch (error) {
       return false; 
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
    try {
        const existe = await Historial.findOneAndUpdate({
            $or: [{ curso: payload.curso, usuario: payload.usuario }]
        }, payload);
        
    } catch (error) {
        const historial = new Historial( payload );
            await historial.save();
            return true;
    }
    
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
    grabarMensaje,
    grabarHistorial,
    guardarCursoSocket
}