//============================================================================
// Requires
//============================================================================
const express = require('express');
const Sequelize = require('sequelize');
const config    = require('../config/setting').CONFIG;

//============================================================================
// Importar modelo del empresa
//============================================================================
var sequelize = new Sequelize(config);
var empresa = require('../models/empresas')(sequelize, Sequelize.DataTypes);

//============================================================================
// Inicializar variables
//============================================================================
var app = express();

//============================================================================
// Obtener todas las empresas de la DB
//============================================================================
app.get('/', (req, res) => {  
  
    let hasta =req.query.hasta || 5;
    let desde =req.query.desde || 0;

    empresa
    .findAndCountAll({order:[['nombre','ASC']], limit:hasta, offset:desde})
        .then(student => {
            res.status(200).json({
                ok: true,
                empresas: student.rows,
                total: student.count
            });
        })
        .catch(err => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando empresas',
                errors: err
            });
        });
});

//============================================================================
// Buscar empresa por Id de la DB
//============================================================================
app.get('/:id', (req, res) => {

    const id      = req.params.id;    
    empresa
    .findByPk(id)
        .then(student => {            
            if( student === null ) {
                return res.status(500).json({
                         ok: false,
                         mensaje: `No existe el empresa con el ID: ${id}` 
                         });                                       
            } else {
                return res.status(200).json({
                        ok: true,
                        empresa: student
                });              
            }       
        })
        .catch(err => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando empresas',
                errors: err
            });
        });    
    });

//====================================================================================
// Actualizar empresa por Id de la DB - nota update retorna una matriz [indice][empresa]
//====================================================================================
app.put('/:id', (req, res, next) => {

    const id      = req.params.id;
    const body    = req.body;
    console.log(body);
    
    empresa
        .update({
                
                nombre: body.nombre,                
                direccion: body.direccion,
                cuit: body.cuit,
                cod_empresa: body.cod_empresa
                
                }, {
                    returning: true,
                    where: { id: id }            
                })
                .then( resp => {
                 return  res.status(200).json({
                        ok: true,
                        empresa: resp[1]
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar empresa',
                        errors: err
                    });
                });
});

//============================================================================
// Crear empresa - revisar por que no toma la fecha
//============================================================================
app.post('/',(req, res, next) =>{

    const body = req.body;
    const anio = new Date().getFullYear();
    const mes = new Date().getMonth();
    const dia = new Date().getDate();
    const fecha = `${dia}/${mes}/${anio}`;
    console.log(fecha);
    empresa
        .create({
            nombre: body.nombre,
            direccion: body.direccion,
            cuit: body.cuit,
            img: body.img,
            cod_empresa: body.cod_empresa              
        })
        .then( resp => {
            return res.status(202).json({
                ok:true,
                newAlumno: resp
            });
        })
        .catch( err => {
            return res.status(500).json({
                ok:false,
                mensaje: 'No se pudo ingresar un nuevo empresa',
                errors: err
            });
        });
});

//============================================================================
// Borrar empresa de la DB mediante el Id
//============================================================================
app.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    
    empresa
        .destroy({ where: { id: id } })
            .then( resp =>{
                if( resp === 1 ) {
                    return res.status(200).json({
                        ok:true,
                        empresaBorrado: resp
                });
                } else {
                    return res.status(500).json({
                        ok: false,
                        mensaje: `No se pudo borrar el empresa, con el Id: ${id}` 
                        }); 
                }

            })
            .catch( err => {
                return res.status(500).json({
                    ok:false,
                    mensaje: 'No se pudo borrar el empresa',
                    errors: err
                });
            });
});

module.exports = app;

