//============================================================================
// Requires
//============================================================================
const express = require('express');
const Sequelize = require('sequelize');
const config    = require('../config/setting').CONFIG;

//============================================================================
// Importar modelo del acuerdo
//============================================================================
var sequelize = new Sequelize(config);
var acuerdo = require('../models/acuerdos')(sequelize, Sequelize.DataTypes);

//============================================================================
// Inicializar variables
//============================================================================
var app = express();

//============================================================================
// Obtener todos los acuerdos de la DB
//============================================================================
app.get('/', (req, res) => {  
  
    let hasta =req.query.hasta || 5;
    let desde =req.query.desde || 0;


    acuerdo
    .findAndCountAll({order:[['nombre','ASC']], limit:hasta, offset:desde})
        .then(resp => {
            res.status(200).json({
                ok: true,
                acuerdos: resp.rows,
                total: resp.count
            });
        })
        .catch(err => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando acuerdos',
                errors: err
            });
        });
});

//============================================================================
// Buscar acuerdo por Id de la DB
//============================================================================
app.get('/:id', (req, res) => {

    const id = req.params.id;    
    acuerdo
    .findByPk(id)
        .then(resp => {            
            if( resp === null ) {
                return res.status(500).json({
                         ok: false,
                         mensaje: `No existe el acuerdo con el ID: ${id}` 
                         });                                       
            } else {
                return res.status(200).json({
                        ok: true,
                        acuerdo: resp
                });              
            }       
        })
        .catch(err => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando acuerdos',
                errors: err
            });
        });    
    });

//====================================================================================
// Actualizar acuerdo por Id de la DB - nota update retorna una matriz [indice][acuerdo]
//====================================================================================
app.put('/:id', (req, res, next) => {

    const id      = req.params.id;
    const body    = req.body;
    console.log(body);
    
    acuerdo
        .update({
            tipo_acuerdo:body.tipo_acuerdo,
            area_trabajo:body.area_trabajo,
            asig_mensual:body.asig_mensual,
            obra_social:body.obra_social,
            art:body.art,
            caracteristicas:body.caracteristicas,
            observaciones:body.observaciones,
            }, {
                    returning: true,
                    where: { id: id }            
                })
                .then( resp => {
                 return  res.status(200).json({
                        ok: true,
                        acuerdo: resp[1]
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar acuerdo',
                        errors: err
                    });
                });
});

//============================================================================
// Crear acuerdo - revisar por que no toma la fecha
//============================================================================
app.post('/',(req, res, next) =>{

    const body = req.body;
    const anio = new Date().getFullYear();
    const mes = new Date().getMonth();
    const dia = new Date().getDate();
    const fecha = `${anio}-${mes}-${dia}`;
    console.log(fecha);

    acuerdo
        .create({
            tipo_acuerdo: body.tipo_acuerdo,
            area_trabajo: body.area_trabajo,
            asig_mensual: body.asig_mensual,
            obra_social: body.obra_social,
            art: body.art,
            num_expediente: body.num_expediente,
            cod_acuerdo: body.cod_acuerdo,
            inicio: body.inicio,
            fin: body.fin,
            caracteristicas: body.caracteristicas,
            observaciones: body.observaciones,
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
                mensaje: 'No se pudo ingresar un nuevo acuerdo',
                errors: err
            });
        });
});

//============================================================================
// Borrar acuerdo de la DB mediante el Id
//============================================================================
app.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    
    acuerdo
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
                        mensaje: `No se pudo borrar el acuerdo, con el Id: ${id}` 
                        }); 
                }

            })
            .catch( err => {
                return res.status(500).json({
                    ok:false,
                    mensaje: 'No se pudo borrar el acuerdo',
                    errors: err
                });
            });
});

module.exports = app;

