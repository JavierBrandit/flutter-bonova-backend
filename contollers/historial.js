const Historial = require('../models/historial');



const obtenerGuardado = async(req, res) => {
    
    const miId = req.uid;
    // const curso = req.params.cid;

    const last30 = await Historial.find({
        $or: [{ usuario: miId }]
    })
    .sort({ createdAt: 'desc'})
    .limit(30);

    res.json({
        ok: true,
        historial: last30
    })
}







module.exports = {
    obtenerGuardado
}