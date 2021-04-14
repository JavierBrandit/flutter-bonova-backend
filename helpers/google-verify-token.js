
const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = '1034710890619-u6849tchecqqvpesq7o51n18krs27lpi.apps.googleusercontent.com';

const client = new OAuth2Client(CLIENT_ID);

const validarGoogleIdToken = async ( token ) => {

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: [
                CLIENT_ID,
                '1034710890619-n7qk14gf0s1qd3kub21rpvtgmb5tu7qr.apps.googleusercontent.com'

            ],  
        });
        const payload = ticket.getPayload();

        console.log('============ PAYLOAD ============= ');
        console.log( payload );
    
        return {
            name: payload['name'],
            picture: payload['picture'],
            email: payload['email'],
        }
    } catch (error) {
        console.log(error);
        return null;
    }

   
}


module.exports = {
    validarGoogleIdToken
}

