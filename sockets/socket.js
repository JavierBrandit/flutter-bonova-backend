const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { getHistorial, usuarioConectado, usuarioDesconectado, grabarMensaje, grabarHistorial, obtenerCursos, borrarHistorial, editar } = require('../contollers/socket');
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
    
    //                       MENSAJES
    client.on('mensaje-personal', (payload) => {
        grabarMensaje( payload );
        io.to( payload.para ).emit('mensaje-personal', payload);
    });
    
    
    //                       GUARDAR/BORRAR HISTORIAL
    client.on('historial', async (payload) => {
        grabarHistorial( payload, uid );
        const h = await getHistorial(uid);
        io.to( payload.usuario ).emit('ver-historial', h  );
    });
    client.on('borrar-historial', async (payload) => {
        borrarHistorial(payload);
        const h = await getHistorial(uid);
        io.to( payload.usuario ).emit('ver-historial', h  );
    });
    
    
    //                       EDITAR USUARIO
    client.on('editar-usuario', async (payload) => {
        const usuario = await editar( payload, uid );
        io.to( uid ).emit('editar-usuario', usuario);
    });


    client.on('disconnect', () => {
        usuarioDesconectado(uid);
    });



});
