//============================================================================
// Requires
//============================================================================
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const config    = require('../config/setting').CONFIG;
const SEED = require('../config/setting').SEED;

// Google
const CLIENT_ID  = require('../config/setting').CLIENT_ID;
const { OAuth2Client } = require( 'google-auth-library' );   
const client   = new OAuth2Client ( CLIENT_ID ); 


//============================================================================
// Importar modelo del empresa
//============================================================================
var sequelize = new Sequelize(config);
var usuario = require('../models/usuarios')(sequelize, Sequelize.DataTypes);

//============================================================================
// Inicializar variables
//============================================================================
var app = express();

//============================================================================
// Login con Google
//============================================================================

async function verify( token ) { 
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
        
    };
  }

app.post('/google', async(req, res) => {

    let token = req.body.token;

    let googleUser = await verify(token)
                            .catch( e => {
                                return res.status(403).json({
                                    ok:false,
                                    mensaje: 'Token no válido!'
                                });
                            });

    usuario.findAndCountAll({where:{email: googleUser.email}})             
                .then(userDB => {
                    if ( userDB.count > 0 ) {
                       if ( userDB.rows[0].google === false) {
                            return res.status(400).json({
                                ok:false,
                                mensaje: 'Debe de usar su autentificación normal!'
                            });
                       } else {
                           // Crear token
                            const token = jwt.sign({ usuario: userDB.rows[0] }, SEED,{ expiresIn: 14400 }); //4 horas
                            res.status(200).json({
                                ok: true,           
                                user: userDB.rows[0],
                                token: token,
                                id: userDB.rows[0].id
                        }); 
                       }
                    } else {
                        // el usuario no existe.. hay que crearlo
                        usuario.create({
                            nombre:   googleUser.nombre,                
                            email:    googleUser.email,
                            password: ':)',
                            img:      googleUser.img,
                            google: true                      
                        })
                        .then( resp => {

                            const token = jwt.sign({ usuario: resp }, SEED,{ expiresIn: 14400 }); //4 horas
                            return res.status(202).json({
                                ok:true,
                                newUser: resp,
                                token: token,
                                id: resp.id
                            });
                        })
                        .catch( err => {
                            return res.status(500).json({
                                ok:false,
                                mensaje: 'No se pudo crear un nuevo usuario google',
                                errors: err
                            });
                        
                    
                        });
                    }
                
                })



//   return  res.status(200).json({
//         ok: true,           
//         mensaje: 'OK',
//         googleUser: googleUser
              
//     });
});



//============================================================================
// Login Normal
//============================================================================
app.post('/', (req, res) => {
    
    const body = req.body;
    console.log(body.email);


    usuario.findAndCountAll({where:{email:body.email}})
            .then( userDB => {
               
                if (userDB.count === 0) {
                    return res.status(400).json({
                        ok: false,           
                        mensaje: 'Credenciales incorrectas - email'            
                    });
                }
                
                if ( !bcrypt.compareSync(body.password, userDB.rows[0].password)) {
                    return res.status(400).json({
                        ok: false,           
                        mensaje: 'Credenciales incorrectas - password'            
                    });    
                }
                // Oculto la contraseña
                userDB.rows[0].password = '';
                // Crear token
                const token = jwt.sign({ usuario: userDB.rows[0] }, SEED,{ expiresIn: 14400 }); //4 horas

                     res.status(200).json({
                          ok: true,           
                        user: userDB.rows[0],
                       token: token,
                          id: userDB.rows[0].id
                    });                
            });                
    });
        
                 

   







module.exports = app;