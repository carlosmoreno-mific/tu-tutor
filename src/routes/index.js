const express = require("express");
const router = express.Router();

router.get("/", function(request, response) {
  response.render("index", { title: 'Inicio' });
});

router.get("/acercaDe", function(request, response) {
  response.render("acercaDe", { title: 'Acerca de' });
});

router.get("/contacto", function(request, response) {
  response.render("contacto", { title: 'Contacto' });
});


module.exports = router;