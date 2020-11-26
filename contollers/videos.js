const { response } = require('express');
const Video = require('../models/videos');


const obtenerVideos = async (req, res = response ) => {

    const desde = Number( req.query.desde ) || 0; 
    
    //   await Video
    //     .find({ _id: { $ne: req.uid } }) //excluirme como usuario
    //     //.skip(desde)
    //     //.limit(20)
    //     .

    
    const videos = await Video
        .find({ _id: { $ne: req.uid } }) //excluirme como usuario
        .sort('-online') //ordenar por online descendentemente
        .skip(desde)
        .limit(30)
    
    
    res.json({
        ok:true,
        videos

    })
}
const postearVideos = async (req, res = response ) => {

    
    const video = new Video( req.body );

    await video.save();

    
    //   await Video
    //     .find({ _id: { $ne: req.uid } }) //excluirme como usuario
    //     //.skip(desde)
    //     //.limit(20)
    //     .
    
    
    res.json({
        ok: true,
        video

    })
}

module.exports = {
    obtenerVideos,
    postearVideos
}
