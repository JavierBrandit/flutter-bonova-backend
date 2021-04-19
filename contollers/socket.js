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

//AQUI REALMENTE SE GUARDA EL HISTORIAL
const grabarHistorial = async ( payload, uid = '' ) => {
    /*
    {
        curso: '',
        progreso: 0.2,
    }
    */    

    let cid = payload.curso;
    
    try {

        const existeHistorial = await Historial.findOne({ curso: cid });
        if( existeHistorial ) {

            historial = await Historial.findOneAndUpdate({ curso: cid }, payload, {new: true} );

            const historiales = await Historial.find({ usuario: uid });

            return historiales;
            
            
        } else {
            historial = new Historial( payload );
            await historial.save();        }
            
            const historiales = await Historial.find({ usuario: uid });
            return historiales;
        
    } catch (error) {
        console.log(error);
    }
}

//AQUI REALMENTE SE BORRA EL HISTORIAL
const borrarHistorial = async ( payload ) => {

    let cid = payload;
    
    try {

        historial = await Historial.findOneAndDelete({ curso: cid });

        const historiales = await Historial.find({ usuario: uid });

        return historiales;
        
    } catch (error) {
        console.log(error);
    }
}
// AQUI REALMENTE SE OBTIENE EL HISTORIAL
const getHistorial = async ( uid = '' ) => {
    /*
    {
        curso: '',
        progreso: 0.2,
    }
    */    
    
    try {
        
        const historial = await Historial.find({ usuario: uid })
            .sort('-updatedAt')
            .populate({
                path: 'curso',
                populate: { path: 'profesor' }
              });

        return historial;
        
    } catch (error) {
        console.log(error);
    }
}

const obtenerCursos = async ( uid = '' ) => {


    var hh = await Historial.find( { usuario: uid } )
                                     .populate({
                                        path: 'curso',
                                        populate: { path: 'profesor' }
                                      });
    var element = []

    function name(historial) {
        
        for (var i in historial) {
           if (Object.hasOwnProperty.call(historial, i)) {
               element.push(historial[i].curso);
               i+=1;   
           }
       }
       return element;
    }
    
    const lista = name(hh);
    
    const desde = Number( req.query.desde ) || 0; 
    
    const cursos = await Curso
        .find( { _id: { $nin: lista } })
        .populate('profesor')
        .sort({ createdAt: 'desc'})
        .skip(desde)
        .limit(30);
    
    
    function nameH(curso) {
        
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

    const historial = nameH(cursos);
    
    return historial;

}

// const guardarCursoSocket = async ( payload ) => {

// }




module.exports = {
    usuarioConectado,
    usuarioDesconectado,
    editar,
    grabarMensaje,
    grabarHistorial,
    // guardarCursoSocket,
    getHistorial,
    obtenerCursos,
    borrarHistorial
}