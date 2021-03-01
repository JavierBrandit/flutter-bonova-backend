
const Mensaje = require('../models/mensaje');
const Historial = require('../models/historial');



const obtenerChat = async(req, res) => {
    
    const miId = req.uid;
    const mensajesDe = req.params.de;

    const last30 = await Mensaje.find({
        $or: [{ de: miId, para: mensajesDe }, { de: mensajesDe, para: miId }]
    })
    .sort({ createdAt: 'desc'})
    .limit(30);

    res.json({
        ok: true,
        mensajes: last30
    })
}

const obtenerHistorial = async(req, res) => {
    
    const miId = req.uid;
    const cid = req.params.cid;

    const last30 = await Histotial.find({
        $or: [{ curso: cid, usuario: miId }]
    })
    .sort({ createdAt: 'desc'})
    .limit(30);

    res.json({
        ok: true,
        historial: last30
    })
}





module.exports = {
    obtenerChat,
    obtenerHistorial
}