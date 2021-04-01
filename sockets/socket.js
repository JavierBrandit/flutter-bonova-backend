const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje, grabarHistorial, guardarCursoSocket } = require('../contollers/socket');
const { verHistorial } = require('../contollers/auth_controller');


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');
    const [ valido, uid ] = comprobarJWT( client.handshake.headers['x-token'] );

    // Verificar autenticacion
    if ( !valido ) { return client.disconnect(); }

    // Cliente conectado
    usuarioConectado( uid );

    client.emit(  );

    // Ingresar al usuario a una sala en particular
    // sala global, clien.id, 5fada84f6b7aa944aefe4a40
    client.join( uid );

    // Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', (payload) => {
       grabarMensaje( payload );
       io.to( payload.para ).emit('mensaje-personal', payload);
    });

    // Escuchar del cliente el historial
    client.on('historial', (payload) => {
       grabarHistorial( payload, uid );
       const h = await verHistorial();
       io.to( payload.usuario ).emit('historial', h );
    });

    // client.on('editar', (payload) => {
    //    editar( payload, uid );
    //    io.to( payload.usuario ).emit('editar', payload);
    // });

    // client.on('guardar', (payload) => {
    //    guardarCursoSocket(uid, payload);
    // //    grabarHistorial( payload );
    //    io.to( uid ).emit('guardar', payload);
    // });
    
    client.on('disconnect', () => {
        usuarioDesconectado(uid);
    });



});
