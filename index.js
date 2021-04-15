const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// DB Config
require('./database/config').dbConnection();


// App de Express
const app = express();
app.use( cors() );

// Lectura y Parseo del body
app.use( express.json() );



// Node Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');



// Path público
const publicPath = path.resolve( __dirname, 'public' );
app.use( express.static( publicPath ) );

// Mis Rutas
app.use( '/api/login',    require('./routes/auth') );
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/mensajes', require('./routes/mensajes') );
app.use( '/api/video',    require('./routes/videos') );
app.use( '/api/curso',    require('./routes/cursos') );
app.use( '/api/search',    require('./routes/search') );



server.listen( process.env.PORT, ( err ) => {

    if ( err ) throw new Error(err);

    console.log('Servidor corriendo en puerto', process.env.PORT );

});


