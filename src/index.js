const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');

const methodOverride = require('method-override');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(validator());
app.use(expressLayouts);
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
require('./config/passport');
app.use(methodOverride('_method'));

//conectando a BD
mongoose
  .connect('mongodb://localhost/tuTutor-db',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  .then(db => console.log('Conectado a bd'))
  .catch(err => console.log(err));

//info de sesion
app.use(function (request, response, next) {
  response.locals.login = request.isAuthenticated();
  response.locals.user = request.user;
  next();
});

//importando rutas
const indexRoutes = require('./routes/index');
const temasRoutes = require('./routes/tema');
const usuariosRoutes = require('./routes/usuario');

//config
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

//rutas
app.use('/', indexRoutes);
app.use('/tema', temasRoutes);
app.use('/usuario', usuariosRoutes);

app.use(function (request, response, next) {
  var err = new Error('No encontrado');
  err.status = 404;
  next(err);
});

//Iniciando el servidor
app.listen(3000, function () {
  console.log('Escuchando en 3000');
});
