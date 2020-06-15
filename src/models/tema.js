const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marked = require('marked');
const slugify = require('slugify');
const domPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const createDomPurify = domPurify(new JSDOM().window);

const temaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario'
    }
}, {
    timestamps: true
});

temaSchema.pre('validate', function (next) {
    if (this.contenido) {
        this.sanitizedHtml = createDomPurify.sanitize(marked(this.contenido));
    }

    next();
})

module.exports = mongoose.model('tema', temaSchema);