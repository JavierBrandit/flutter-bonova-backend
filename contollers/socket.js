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

    let cid = payload.curso;
    
    try {

        const existeHistorial = await Historial.findOne({ curso: cid });
        // const existeEmail = await Usuario.findOne({ email });
        if( existeHistorial ) {

            historial = await Historial.findOneAndUpdate({ curso: cid }, payload, {new: true} );

            const historiales = await Historial.find({ usuario: uid });

            return historiales;
            
            
        } else {
            historial = new Historial( payload );
            await historial.save();        }
            
            const historiales = await Historial.find({ usuario: uid });
            return historiales;
            
        // res.json({
        //     historial,
        // });
        
    } catch (error) {
        console.log(error);
    }
}

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


    // const usuario = await Usuario.findById( uid ).populate('historial');
    var hh = await Historial.find( { usuario: uid } )
                                    //  .populate('curso');
                                     .populate({
                                        path: 'curso',
                                        populate: { path: 'profesor' }
                                      });
    // const historiala = historial[0].curso;
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
    guardarCursoSocket,
    getHistorial,
    obtenerCursos
}