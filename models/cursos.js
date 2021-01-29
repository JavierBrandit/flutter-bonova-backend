const { Schema, model } = require('mongoose');
const Video = require('../models/videos');

const CursoSchema = Schema({

    titulo: {
       type: String,
       required: true
    },
    ramo: {
        type: String,
        required: true
    },
    nivel: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
    },
    progreso: {
        type: Number,
    },
    portada: {
        type: String,
    },
    profesor: {
        type: String,
    },
    guardado: {
        type: Boolean,
        default: false
    },
    videos: [{
        type: Schema.Types.ObjectId,
        ref: 'Video',
    },],
    descripcion: {
        type: String,
    },
    thumbnail: {
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
    precio: {
        type: String,
    },

}, {
    timestamps: true
});

CursoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
});

module.exports = model('Curso', CursoSchema);