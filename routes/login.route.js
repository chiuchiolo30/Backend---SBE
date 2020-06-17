/*jshint esversion: 6 */ 

// =================================
//	Requires
// =================================
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SEED = require('../config/setting').SEED;

const app = express();

// Importamos el esquema de usuario
const Usuario = require('../models/usuario.model');

// Google
const CLIENT_ID = require('../config/setting').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

//============================================================================
// Autenticación de Google
//============================================================================
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    return {
        nombre  : payload.name,
        email   : payload.email,
        img     : payload.picture,
        google  : true
    };
  }

app.post('/google', async(req, res) => {

    const token = req.body.token;

    let googleUser = await verify( token )
        .catch( e => {
            res.status(403).json({
                ok: false,
                mensaje: 'Token no válido'
            });
        });

        Usuario.findOne( { email: googleUser.email }, (err, usuarioDB) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                    });
            }
            if ( usuarioDB ) {
               if (usuarioDB.google === false ) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Debe de usar su autenticación normal'
                        });
               } else {
                const token = jwt.sign( { usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

                res.status(200).json({
                    ok: true,
                    Usuario: usuarioDB,
                    token: token,        
                    id: usuarioDB._id,
                    menu: obtenerMenu(usuarioDB.role)
                });
               }
            } else {
                // el usuario no existe... hay que crearlo
                const usuario = new Usuario();

                usuario.nombre = googleUser.nombre;
                usuario.email = googleUser.email;
                usuario.img = googleUser.img;
                usuario.google = true;
                usuario.password = ':)';

                usuario.save((err, usuarioDB) => {
                    const token = jwt.sign( { usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

                    res.status(200).json({
                        ok: true,
                        Usuario: usuarioDB,
                        token: token,        
                        id: usuarioDB._id,
                        menu: obtenerMenu(usuarioDB.role)
                    });
                });
            }
        });
});

//============================================================================
// Autenticación normal
//============================================================================
app.post('/', (req, res) => {

    const body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

            if ( err ) {
                 return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar usuarios',
                        errors: err
                    });
            }
            if ( !usuarioDB ) {
                return res.status(400).json({
                        ok: false,
                        mensaje: 'Credenciales incorrectas - email',
                        errors: err
                    });
            }
            if ( !bcrypt.compareSync( body.password, usuarioDB.password ) ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas - password',
                    errors: err
                });
            }

            // Crear un token
            usuarioDB.password = ':)';
            
            var token = jwt.sign( { usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

            res.status(200).json({
                ok: true,
                Usuario: usuarioDB,
                token: token,        
              /*   id: usuarioDB._id,
                menu: obtenerMenu(usuarioDB.role) */
            });
     });
 
});

function obtenerMenu( ROLE ) {
    let menu = [
        {
          titulo: 'Principal',
          icono: 'mdi mdi-gauge',
          submenu: [
            { titulo: 'Dashboard', url: '/' },
            { titulo: 'ProgressBar', url: '/' },
            { titulo: 'Gràficas', url: '/' },
            { titulo: 'Promesas', url: '/' },
            { titulo: 'Rxjs', url: '/' }
          ]
        },
        {
          titulo: 'Mantenimiento',
          icono: 'mdi mdi-folder-lock-open',
          submenu: [
            // { titulo: 'Usuarios', url: '/usuarios' },
            { titulo: 'Hospitales', url: '/' },
            { titulo: 'Medicos', url: '/' }
          ]
        }
      ];

      if ( ROLE === 'ADMIN_ROLE') {
          menu[1].submenu.unshift( { titulo: 'Usuarios', url: '/' } );
      }

    return menu;

}



module.exports = app;