//============================================================================
// Requires
//============================================================================
const express = require('express');
const Sequelize = require('sequelize');
const config    = require('../config/setting').CONFIG;

//============================================================================
// Importar modelo del convenio
//============================================================================
var sequelize = new Sequelize(config);
var convenio = require('../models/convenios')(sequelize, Sequelize.DataTypes);

//============================================================================
// Inicializar variables
//============================================================================
var app = express();

//============================================================================
// Obtener todos los convenios de la DB
//============================================================================
app.get('/', (req, res) => {  
  
    let hasta =req.query.hasta || 5;

    convenio
    .findAndCountAll({limit:hasta})
        .then(resp => {
            res.status(200).json({
                ok: true,
                convenios: resp.rows,
                total: resp.count
            });
        })
        .catch(err => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando convenios',
                errors: err
            });
        });
});

//============================================================================
// Buscar convenio por Id de la DB
//============================================================================
app.get('/:id', (req, res) => {

    const id = req.params.id;    
    convenio
    .findByPk(id)
        .then(resp => {            
            if( resp === null ) {
                return res.status(500).json({
                         ok: false,
                         mensaje: `No existe el convenio con el ID: ${id}` 
                         });                                       
            } else {
                return res.status(200).json({
                        ok: true,
                        convenio: resp
                });              
            }       
        })
        .catch(err => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando convenios',
                errors: err
            });
        });    
    });

//====================================================================================
// Actualizar convenio por Id de la DB - nota update retorna una matriz [indice][convenio]
//====================================================================================
app.put('/:id', (req, res, next) => {

    const id      = req.params.id;
    const body    = req.body;
    console.log(body);
    
    convenio
        .update({
            nombre: body.nombre,
            fin: body.fin
            }, {
                    returning: true,
                    where: { id: id }            
                })
                .then( resp => {
                 return  res.status(200).json({
                        ok: true,
                        convenio: resp[1]
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar convenio',
                        errors: err
                    });
                });
});

//============================================================================
// Crear convenio - revisar por que no toma la fecha
//============================================================================
app.post('/',(req, res, next) =>{

    const body = req.body;
    const anio = new Date().getFullYear();
    const mes = new Date().getMonth();
    const dia = new Date().getDate();
    const fecha = `${anio}-${mes}-${dia}`;
    console.log(fecha);

    convenio
        .create({
            nombre: body.nombre,
            inicio: body.inicio,
            fin: body.fin,
            num_acuerdo: body.num_acuerdo,
            num_expediente: body.num_expediente,
            tipo_convenio: body.tipo_convenio,
            id_personales: body.id_personales
            },
            { returning: true})
        .then( resp => {
            return res.status(202).json({
                ok:true,
                newTutor: resp
            });
        })
        .catch( err => {
            return res.status(500).json({
                ok:false,
                mensaje: 'No se pudo ingresar un nuevo convenio',
                errors: err
            });
        });
});

//============================================================================
// Borrar convenio de la DB mediante el Id
//============================================================================
app.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    
    convenio
        .destroy({ where: { id: id } })
            .then( resp =>{
                if( resp === 1 ) {
                    return res.status(200).json({
                        ok:true,
                        tutorBorrado: resp
                });
                } else {
                    return res.status(500).json({
                        ok: false,
                        mensaje: `No se pudo borrar el convenio, con el Id: ${id}` 
                        }); 
                }

            })
            .catch( err => {
                return res.status(500).json({
                    ok:false,
                    mensaje: 'No se pudo borrar el convenio',
                    errors: err
                });
            });
});

module.exports = app;

