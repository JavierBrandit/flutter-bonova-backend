const { response } = require('express');
const Curso = require('../models/cursos');
const Usuario = require('../models/usuario');
const Historial = require('../models/historial');


const obtenerCursos = async (req, res = response ) => {

    const uid = req.uid;

    // const usuario = await Usuario.findById( uid ).populate('historial');
    var hh = await Historial.find( { usuario: uid } )
                                     .populate('curso');
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
        // .populate('profesor')
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
    
    
    res.json({
        // ok: true,
        // cursos,
        // lista,
        // historial,
        historial
        // historial,
        // historiala,
        // lista

    })
}

const editar = async ( req, res = response ) => {

    let id = req.params._id;
    let body = req.body 
    
    Curso.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, userBD) => {
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


const getMatematica = async (req, res = response ) => {
    
    const ramo = req.params.ramo;
    const nivel = req.params.nivel;

    const cursos = await Curso.find({
        $or: [{ ramo: ramo, nivel: nivel }]
    })
    // .populate('profesor')
    .sort({ createdAt: 'desc'})
    .limit(30);

    res.json({
        ok: true,
        cursos
    })
}



function crearCurso(req) {
    const {
        titulo,
         ramo,
         nivel,
         rate,
         progreso,
         portada,
         profesor,
         guardado,
         videos,
         descripcion,
         thumbnail,
         views,
         likes,
         compartido,
         comentario,
         precio,
    } = req.body;
  
    return new Curso({  
        titulo: titulo,
        ramo: ramo,
        nivel: nivel,
        rate: rate,
        progreso: progreso,
        portada: portada,
        profesor: profesor,
        guardado: guardado,
        videos: videos,
        descripcion: descripcion,
        thumbnail: thumbnail,
        views: views,
        likes: likes,
        compartido: compartido,
        comentario: comentario,
        precio: precio,
    });
  }

const postearCursos = async (req, res = response ) => {

    // const curso = new Curso( req.body );    
    const curso = crearCurso(req);

    await curso.save()
   
    //   .then((result) => {
    //     res.status(200).json(result);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     res.status(503).json(err);
    //   });
    
    res.json({
        curso
    })
}

module.exports = {
    editar,
    obtenerCursos,
    postearCursos,
    getMatematica
}
