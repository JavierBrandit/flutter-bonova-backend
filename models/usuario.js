const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
       type: String,
       required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    online: {
        type: Boolean,
        default: false
    },
    profesor: {
        type: Boolean,
        default: false
    },
    celular: {
        type: String,
    },
    antiguedad: {
        type: Date,
    },
    cursos: [{
        type: Schema.Types.ObjectId,
        ref: 'Curso',
    },],
    comuna: {
        type: String,
    },
    colegio: {
        type: String,
    },
    curso: {
        type: String,
    },
    contactos: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },],
    foto: {
        type: String,
    },
    descripcion: {
        type: String,
    },
    recordatorio: {
        type: Boolean,
        default: true,
    },
   

});

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid= _id;
    return object;
});

module.exports = model('Usuario', UsuarioSchema);

///


    // wishlist: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Movie",
    //   },
    // ],
