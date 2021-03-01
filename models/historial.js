const { Schema, model } = require('mongoose');
const Curso = require('../models/cursos');
const Usuario = require('../models/cursos');

const HistorialSchema = Schema({

    curso: {
       type: Schema.Types.ObjectId,
       ref: 'Curso',
       required: true
    },
    usuario: {
       type: Schema.Types.ObjectId,
       ref: 'Usuario',
       required: true
    },
    progreso: {
        type: Number,
    },
    // fecha: {
    //     type: Date,
    // },

}, 
{
    timestamps: true
}
);

HistorialSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.hid = _id;
    return object;
});

module.exports = model('Historial', HistorialSchema);