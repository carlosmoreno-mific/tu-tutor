const Tema = require('../models/tema');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tuTutor-db');

var temas = [

    new Tema({
        nombre: 'Introducción a límites',
        descripcion: 'A veces algo no se puede calcular directamente... ¡pero puedes saber cuál debe de ser el resultado si te vas acercando más y más!',
        contenido: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget eros gravida, tempor nisl vel, viverra velit. In tempus, mi vitae rhoncus mattis, diam justo pretium massa, vitae pellentesque ligula nulla et ante. Aliquam accumsan turpis tincidunt, sodales diam eget, interdum nunc. Proin hendrerit ipsum sit amet magna pharetra gravida. Sed gravida eros quis laoreet luctus. Aliquam et ligula mi. Ut et tempus metus.'
    }),
    new Tema({
        nombre: 'Propiedades de límites',
        descripcion: 'Una explicación muy clara sobre las propriedades de los límites de constante, suma, profucto, cociente, potencia, función, raiz, y también del logaritmo.',
        contenido: 'Mauris augue tellus, accumsan vitae porta a, ultrices nec tellus. Curabitur in sem dignissim, tempus libero vel, scelerisque metus. Praesent accumsan purus odio, quis pulvinar nisl dignissim sed. Maecenas id congue eros. Nam auctor tellus iaculis risus accumsan, sed blandit nunc tempor.'
    }),
    new Tema({
        nombre: 'Límites por sustitución directa',
        descripcion: 'Explicamos cómo puedes encontrar fácilmente límites de funciones en puntos donde la función es continua: ¡simplemente sustituye el valor de x en la función! Más adelante aprenderemos cómo encontrar límites aun cuando la función no sea continua.',
        contenido: 'Nulla dolor purus, rutrum eu augue at, aliquet laoreet ligula. Quisque leo nunc, commodo sed eros eleifend, viverra sollicitudin libero. Nunc enim sapien, imperdiet scelerisque cursus eget, tempus non sapien. Nulla tempor id massa vitae aliquet. Donec ipsum odio, varius et nulla eget, aliquam convallis lectus.'
    })
];

var done = 0;
for (let i = 0; i < temas.length; i++) {
    temas[i].save(function(err, res){
        done++;
        if (done === temas.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}