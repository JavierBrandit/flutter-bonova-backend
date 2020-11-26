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
    videos: {
        type: Object,
        ref: Video,
        required: true
    },

}, {
    timestamps: true
});

CursoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
});

module.exports = model('Curso', CursoSchema);


