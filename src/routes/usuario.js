const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const csrf = require('csurf');
const passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/perfil', estaConectado, function (request, response, next) {
    response.render('usuario/perfil', {
        title: 'Perfil'
    });
});

router.get('/cierreSesion', estaConectado, function (request, response, next) {
    request.logout();
    response.redirect('/');
});

router.use('/', noEstaConectado, function (request, response, next){
    next();
});

router.get('/registro', function (request, response, next) {
    
    var messages = request.flash('error');
    
    response.render('usuario/registro', {
        title: 'Registro',
        csrfToken: request.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });

});

router.post('/registro', passport.authenticate('local.signup', {
    successRedirect: '/usuario/perfil',
    failureRedirect: '/usuario/registro',
    failureFlash: true
}));

router.get('/inicioSesion', function (request, response, next) {
    
    var messages = request.flash('error');
    
    response.render('usuario/inicioSesion', {
        title: 'Iniciar sesión',
        csrfToken: request.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/inicioSesion', passport.authenticate('local', {
    successRedirect: '/usuario/perfil',
    failureRedirect: '/usuario/inicioSesion',
    failureFlash: true
}));

module.exports = router;

function estaConectado(request, response, next) {
    if (request.isAuthenticated()) {
        return next();
    }
    response.redirect('/');
}

function noEstaConectado(request, response, next) {
    if (!request.isAuthenticated()) {
        return next();
    }
    response.redirect('/');
}