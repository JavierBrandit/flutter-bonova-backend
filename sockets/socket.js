const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { getHistorial, usuarioConectado, usuarioDesconectado, grabarMensaje, grabarHistorial, guardarCursoSocket, obtenerCursos } = require('../contollers/socket');
const { verHistorial } = require('../contollers/auth_controller');


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');
    const [ valido, uid ] = comprobarJWT( client.handshake.headers['x-token'] );

    // Verificar autenticacion
    if ( !valido ) { return client.disconnect(); }

    // Cliente conectado
    usuarioConectado( uid );

    
    // Ingresar al usuario a una sala en particular
    // sala global, clien.id, 5fada84f6b7aa944aefe4a40
    client.join( uid );
    // client.emit( 'ver-historial', getHistorial(uid) );
    
    // Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', (payload) => {
       grabarMensaje( payload );
       io.to( payload.para ).emit('mensaje-personal', payload);
    });

    // Escuchar del cliente el historial
    client.on('historial', async (payload) => {
       grabarHistorial( payload, uid );
       const h = await getHistorial(uid);
    //    const c = await obtenerCursos(uid);
       io.to( payload.usuario ).emit('ver-historial', h  );

    //    io.to( payload.usuario ).emit('ver-cursos',    c  );
    });

    // client.on('historial', async (payload) => {
    //    const c = await obtenerCursos(uid);
    //    io.to( payload.usuario ).emit('ver-cursos',    c  );
    // });

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
