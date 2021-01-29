const { Schema, model } = require('mongoose');

const VideoSchema = Schema({

    titulo: {
       type: String,
       required: true
    },
    descripcion: {
        type: String,
    },
    path: {
        type: String,
        required: true
    },
    tituloMod: {
        type: String,
    },
    views: {
        type: Number,
    },
    likes: {
        type: Number,
    },
    compartido: {
        type: Number,
    },
    comentario: [{
        type: Schema.Types.ObjectId,
        ref: 'Mensaje'
    }],
    adjunto: {
        type: String,
    },
    apunte: [{
        type: String,
    }],

    
}, {
    timestamps: true
});

VideoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
});

module.exports = model('Video', VideoSchema);


