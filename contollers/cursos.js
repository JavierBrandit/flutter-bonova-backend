const { response } = require('express');
const Curso = require('../models/cursos');


const obtenerCursos = async (req, res = response ) => {

    
    const desde = Number( req.query.desde ) || 0; 

    const cursos = await Curso
        .find({ _id: { $ne: req.uid } }) //excluirme como usuario
        //.sort('-online') //ordenar por online descendentemente
        .skip(desde)
        .limit(30)
    
    
    res.json({
        ok:true,
        cursos

    })
}


const getMatematica = async (req, res = response ) => {
    
    const ramo = req.params.ramo;
    const nivel = req.params.nivel;

    const cursos = await Curso.find({
        $or: [{ ramo: ramo, nivel: nivel }]
    })
    .sort({ createdAt: 'desc'})
    .limit(30);

    res.json({
        ok: true,
        cursos
    })
}

const postearCursos = async (req, res = response ) => {

    
    const curso = new Curso( req.body );

    await curso.save();

    
    
    res.json({
        curso

    })
}

module.exports = {
    obtenerCursos,
    postearCursos,
    getMatematica
}
