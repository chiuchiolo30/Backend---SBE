//============================================================================
// Requires
//============================================================================
const express = require('express');
const Sequelize = require('sequelize');
const config    = require('../config/setting').CONFIG;
const mdAutenticacion = require('../middleware/autenticacion');


//============================================================================
// Importar modelo del tutor
//============================================================================
var sequelize = new Sequelize(config);
var tutor = require('../models/personales')(sequelize, Sequelize.DataTypes);

//============================================================================
// Inicializar variables
//============================================================================
var app = express();

//============================================================================
// Obtener todos los tutors de la DB
//============================================================================
app.get('/', (req, res) => {  
  
    let hasta =req.query.hasta || 5;
    let desde =req.query.desde || 0;

    tutor
    .findAndCountAll({order:[['nombre','ASC']], limit:hasta, offset:desde})
        .then(resp => {
            res.status(200).json({
                ok: true,
                personal: resp.rows,
                total: resp.count
            });
        })
        .catch(err => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando tutores',
                errors: err
            });
        });
});

//============================================================================
// Buscar tutor por Id de la DB
//============================================================================
app.get('/:id', (req, res) => {

    const id = req.params.id;    
    tutor
    .findByPk(id)
        .then(resp => {            
            if( resp === null ) {
                return res.status(500).json({
                         ok: false,
                         mensaje: `No existe el tutor con el ID: ${id}` 
                         });                                       
            } else {
                return res.status(200).json({
                        ok: true,
                        personal: resp
                });              
            }       
        })
        .catch(err => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando tutores',
                errors: err
            });
        });    
    });

//====================================================================================
// Actualizar tutor por Id de la DB - nota update retorna una matriz [indice][tutor]
//====================================================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res, next) => {

    const id      = req.params.id;
    const body    = req.body;
    console.log(body);
    
    tutor
        .update({
                nombre: body.nombre,
                email: body.email,
                dni: body.dni,
                telefono: body.telefono,
                direccion: body.direccion,
                cargo: body.cargo,
                estado: body.estado,
                idempresa: body.idempresa             
                }, {
                    returning: true,
                    where: { id: id }            
                })
                .then( resp => {
                 return  res.status(200).json({
                        ok: true,
                        personal: resp[1],
                        tokenUser: req.usuario
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar tutor',
                        errors: err
                    });
                });
});

//============================================================================
// Crear personal - revisar por que no toma la fecha
//============================================================================
app.post('/', mdAutenticacion.verificaToken, (req, res, next) =>{

    const body = req.body;
    const anio = new Date().getFullYear();
    const mes = new Date().getMonth();
    const dia = new Date().getDate();
    const fecha = `${anio}-${mes}-${dia}`;
    console.log(fecha);
    tutor
        .create({
                nombre: body.nombre,
                dni: body.dni,
                direccion: body.direccion,
                email: body.email,
                telefono: body.telefono,
                img: body.img,
                cargo: body.cargo,
                estado: body.estado,
                idempresa: body.idempresa
        },{returning: true})
        .then( resp => {
            return res.status(202).json({
                ok:true,
                newPersonal: resp,
                tokenUser: req.usuario
            });
        })
        .catch( err => {
            return res.status(500).json({
                ok:false,
                mensaje: 'No se pudo ingresar un nuevo tutor',
                errors: err
            });
        });
});

//============================================================================
// Borrar tutor de la DB mediante el Id
//============================================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    const id = req.params.id;
    
    tutor
        .destroy({ where: { id: id } })
            .then( resp =>{
                if( resp === 1 ) {
                    return res.status(200).json({
                        ok:true,
                        tutorBorrado: resp,
                        tokenUser: req.usuario
                });
                } else {
                    return res.status(500).json({
                        ok: false,
                        mensaje: `No se pudo borrar el tutor, con el Id: ${id}` 
                        }); 
                }

            })
            .catch( err => {
                return res.status(500).json({
                    ok:false,
                    mensaje: 'No se pudo borrar el tutor',
                    errors: err
                });
            });
});

module.exports = app;

