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
    curso: {
        type: String,
    },
    numMod: {
        type: Number,
    },
    tituloMod: {
        type: String,
    },

}, {
    timestamps: true
});

VideoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
});

module.exports = model('Video', VideoSchema);


