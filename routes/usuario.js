//============================================================================
// Requires
//============================================================================
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const config    = require('../config/setting').CONFIG;
const mdAutenticacion = require('../middleware/autenticacion');

//============================================================================
// Importar modelo del empresa
//============================================================================
const sequelize = new Sequelize(config);
const usuario = require('../models/usuarios')(sequelize, Sequelize.DataTypes);

//============================================================================
// Inicializar variables
//============================================================================
const app = express();

//============================================================================
// Obtener todos los usuarios de la DB
//============================================================================
app.get('/', (req, res) => {  
  
    let hasta =req.query.hasta || 5;
    let desde =req.query.desde || 0;
    usuario
    .findAndCountAll({order:[['nombre','ASC']], limit:hasta, offset:desde} )
        .then(user => {
            return res.status(200).json({
                ok: true,
                usuarios: user.rows,
                total: user.count
            });
        })
        .catch(err => {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        });
});

//============================================================================
// Buscar usuario por Id de la DB
//============================================================================
app.get('/:id', (req, res) => {

    const id = req.params.id;

    usuario
    .findByPk(id)
        .then(user => {            
            if( user === null ) {
                 res.status(500).json({
                         ok: false,
                         mensaje: `No existe el usuario con el ID: ${id}` 
                         });                                       
            } else {
                 res.status(200).json({
                        ok: true,
                        usuario: user
                });              
            }       
        })
        .catch(err => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        });    
    });

//====================================================================================
// Actualizar usuario por Id de la DB - nota update retorna una matriz [indice][empresa]
//====================================================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res, next) => {

    const id      = req.params.id;
    const body    = req.body;
    console.log(body);
    
    usuario
        .update({
                
                nombre: body.nombre,                
                email: body.email,
             //   password: bcrypt.hashSync(body.password, 10),
                img: body.img,
                role:     body.role
                
                }, {
                    returning: true,
                    where: { id: id }            
                })
                .then( resp => {
                   res.status(200).json({
                        ok: true,
                        usuario: resp[1]
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: err
                    });
                });
});

//============================================================================
// Crear usuario - revisar por que no toma la fecha
//============================================================================
app.post('/', (req, res, next) =>{

    const body = req.body;

    usuario
        .create({
                nombre:   body.nombre,                
                email:    body.email,
                password: bcrypt.hashSync(body.password, 10),
                img:      body.img,
                role:     body.role             
        })
        .then( resp => {
            return res.status(202).json({
                ok:true,
                newUser: resp,
                tokenUser: req.usuario //este es el usuario que hizo la petición
            });
        })
        .catch( err => {
            return res.status(500).json({
                ok:false,
                mensaje: 'No se pudo crear un nuevo usuario',
                errors: err
            });
        });
});

//============================================================================
// Borrar usuario de la DB mediante el Id
//============================================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    const id = req.params.id;
    
    usuario
        .destroy({ where: { id: id } })
            .then( resp =>{
                if( resp === 1 ) {
                    return res.status(200).json({
                        ok:true,
                        usuarioBorrado: resp,
                        tokenUser: req.usuario
                });
                } else {
                    return res.status(500).json({
                        ok: false,
                        mensaje: `No se pudo borrar el usuario, con el Id: ${id}` 
                        }); 
                }

            })
            .catch( err => {
                return res.status(500).json({
                    ok:false,
                    mensaje: 'No se pudo borrar el usuario',
                    errors: err
                });
            });
});

module.exports = app;

