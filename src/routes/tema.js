const express = require('express');
const router = express.Router();
const Tema = require('../models/tema');
const moment = require('moment');

moment.locale('es');

router.get('/', async (request, response) => {
  const temas = await Tema.find().sort({
    creadoEl: 'desc'
  }).populate('autor');

  response.render('tema/index', {
    title: 'Temas',
    temas: temas,
    moment: moment
  });
});

router.get('/agregar', estaConectado, function (request, response, next) {
  
  var messages = request.flash('error');
  
  response.render('tema/agregar', {
    title: 'Agregar tema',
    tema: new Tema(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.get('/editar/:id', estaConectado, async (request, response) => {
  const tema = await Tema.findById(request.params.id).populate('autor');
  var messages = request.flash('error');
  
  if (tema.autor.id == request.user.id) {
    response.render('tema/editar', {
      title: 'Editar tema',
      tema: tema,
      messages: messages,
      hasErrors: messages.length > 0
    });
  }else{
    response.redirect('/tema');
  }
});

router.get('/:id', async (request, response) => {

  const tema = await Tema.findById(request.params.id).populate('autor');

  if (tema == null) {
    response.redirect('/');
  }

  response.render('tema/mostrar', {
    title: tema.nombre,
    tema: tema,
    moment: moment
  });

});

router.post('/', async (request, response, next) => {
  request.tema = new Tema();
  next();
}, guardarTemaYRedirigir('agregar'));

router.put('/:id', async (request, response, next) => {
  request.tema = await Tema.findById(request.params.id);
  next();
}, guardarTemaYRedirigir('editar'));

router.delete('/:id', estaConectado, async (request, response) => {
  const temaEliminar = await Tema.findById(request.params.id).populate('autor');

  if (temaEliminar.autor.id == request.user.id) {
    await Tema.findByIdAndDelete(request.params.id);
  }

  response.redirect('/tema');

});

function guardarTemaYRedirigir(ruta) {
  return async (request, response) => {
    
    request.checkBody('nombre', 'El campo nombre no puede estar vacío.').notEmpty();
    request.checkBody('descripcion', 'El campo descripción no puede estar vacío.').notEmpty();
    request.checkBody('contenido', 'El campo contenido no puede estar vacío.').notEmpty();

    var errors = request.validationErrors();

    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
    }

    var tema = request.tema;
    tema.nombre = request.body.nombre;
    tema.descripcion = request.body.descripcion;
    tema.contenido = request.body.contenido;
    tema.autor = request.user.id;

    try {
      tema = await tema.save();
      response.redirect(`/tema/${tema._id}`);
    } catch (e) {
      response.render(`tema/${ruta}`, {
        title: '',
        tema: tema,
        messages: messages,
        hasErrors: messages.length > 0
      });
    }
  };
}

module.exports = router;

function estaConectado(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }
  response.redirect('/');
}