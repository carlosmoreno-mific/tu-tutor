const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const usuarioSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    temas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tema'
    }]
});

usuarioSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

usuarioSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('usuario', usuarioSchema);