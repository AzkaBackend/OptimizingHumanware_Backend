const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let empresaSchema = new Schema({
    empresa: {
        type: String,
        required: [true, 'El nombre de la compañía es necesario']
    },
    nombreCompleto: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    empleo: {
        type: String,
        required: [true, 'El empleo es necesario']
    },
    cantidadUsuarios: {
        type: String,
        required: [true, 'El nombre de la compañía es necesario']
    },
    pais: {
        type: String,
        required: [true, 'El país es necesario']
    },
    cp: {
        type: String,
        required: [true, 'El código postal es necesario']
    },
    estado: {
        type: String,
    },
    direccion: {
        type: String,
    },
    numeroTelefono: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    passwordConfirmacion: {
        type: String,
        required: [true, 'La contraseña no coincide']
    },
    activo: {
        type: Boolean,
        default: true
    }
});


empresaSchema.methods.toJSON = function() {

    let company = this;
    let companyObject = company.toObject();
    delete companyObject.password;
    delete companyObject.passwordConfirmacion;

    return companyObject;
}


empresaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


module.exports = mongoose.model('Empresa', empresaSchema);