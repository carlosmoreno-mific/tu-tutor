const passport = require('passport');
const Usuario = require('../models/usuario');
var localStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Usuario.findById(id, function (error, user) {
        done(error, user);
    });
});

passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (request, email, password, done) {

    request.checkBody('email', 'Correo electrónico inválido.').notEmpty().isEmail();
    request.checkBody('password', 'Contraseña inválida.').notEmpty().isLength({ min: 4 });

    var errors = request.validationErrors();

    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, request.flash('error', messages));
    }

    Usuario.findOne({ 'email': email }, function (error, user) {
        if (error) {
            return done(err);
        }

        if (user) {
            return done(null, false, { message: 'Correo electrónico ya está en uso.' })
        }

        var nuevoUsuario = new Usuario();
        nuevoUsuario.email = email;
        nuevoUsuario.password = nuevoUsuario.encryptPassword(password);
        nuevoUsuario.save(function (error, result) {
            if (error) {
                return done(error);
            }

            return done(null, nuevoUsuario);
        })
    });
}));

passport.use(
    'local',
    new localStrategy(
        {usernameField: 'email'},
        (email, password, done) => {

            Usuario.findOne({ 'email': email })
                .then(user => {
                    if(!user){
                        return done(null, false, {message: 'Usuario ó contraseña inválido.'});
                    }

                    return user.validPassword(password) ?
                        done(null, user) :
                        done(null, false, {message: 'Usuario ó contraseña inválido.'});
                })
                .catch(() => done(null, false, {message: 'Usuario ó contraseña inválido.'}))
        }
    )
)