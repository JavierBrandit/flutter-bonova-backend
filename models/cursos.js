const { Schema, model } = require('mongoose');
const Video = require('../models/videos');

const CursoSchema = Schema({

    titulo: {
       type: String,
       required: true,
       index: true
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
    guardado: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }],
    videos: [{
        type: Object,
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

CursoSchema.index({ titulo: 'text', descripcion: 'text', ramo: 'text'});

CursoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.cid = _id;
    return object;
});

Curso = model('Curso', CursoSchema);
Curso.createIndexes();
module.exports = Curso;