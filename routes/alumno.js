//============================================================================
// Requires
//============================================================================
const express = require('express');
const Sequelize = require('sequelize');
const config    = require('../config/setting').CONFIG;
const mdAutenticacion = require('../middleware/autenticacion');


//============================================================================
// Importar modelo del alumno
//============================================================================
var sequelize = new Sequelize(config);
var alumno = require('../models/alumnos')(sequelize, Sequelize.DataTypes);

//============================================================================
// Inicializar variables
//============================================================================
var app = express();

//============================================================================
// Obtener todos los alumnos de la DB
//============================================================================
app.get('/', (req, res) => {  
  
    let hasta =req.query.hasta || 5;
    let desde =req.query.desde || 0;

    alumno
    .findAndCountAll({order:[['nombre','ASC']], limit:hasta, offset:desde})
        .then(student => {
            res.status(200).json({
                ok: true,
                alumnos: student.rows,
                total: student.count
            });
        })
        .catch(err => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando alumnos',
                errors: err
            });
        });
});

//============================================================================
// Buscar alumno por Id de la DB
//============================================================================
app.get('/:id', (req, res) => {

    const id      = req.params.id;    
    alumno
    .findByPk(id)
        .then(student => {            
            if( student === null ) {
                return res.status(500).json({
                         ok: false,
                         mensaje: `No existe el alumno con el ID: ${id}` 
                         });                                       
            } else {
                return res.status(200).json({
                        ok: true,
                        alumno: student
                });              
            }       
        })
        .catch(err => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando alumnos',
                errors: err
            });
        });    
    });

//====================================================================================
// Actualizar alumno por Id de la DB - nota update retorna una matriz [indice][alumno]
//====================================================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res, next) => {

    const id      = req.params.id;
    const body    = req.body;
    console.log(body);
    
    alumno
        .update({
                nombre: body.nombre,
                dni: body.dni,
                direccion: body.direccion,
                email: body.email,
                telefono: body.telefono,
                carrera: body.carrera,
                libreta: body.libreta,
                img: body.img,
                id_acuerdo: body.id_acuerdo
                }, {
                    returning: true,
                    where: { id: id }            
                })
                .then( resp => {
                 return  res.status(200).json({
                        ok: true,
                        alumno: resp[1]
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar alumno',
                        errors: err
                    });
                });
});

//============================================================================
// Crear alumno - revisar por que no toma la fecha
//============================================================================
app.post('/', mdAutenticacion.verificaToken, (req, res, next) =>{

    const body = req.body;
    const anio = new Date().getFullYear();
    const mes = new Date().getMonth();
    const dia = new Date().getDate();
    const fecha = `${dia}/${mes}/${anio}`;
    console.log(fecha);
    alumno
        .create({
                nombre: body.nombre,
                dni: body.dni,
                direccion: body.direccion,
                email: body.email,
                telefono: body.telefono,
                carrera: body.carrera,
                libreta: body.libreta,
                id_acuerdo: body.id_acuerdo,
                img: body.img

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
                mensaje: 'No se pudo ingresar un nuevo alumno',
                errors: err
            });
        });
});

//============================================================================
// Borrar alumno de la DB mediante el Id
//============================================================================
app.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    
    alumno
        .destroy({ where: { id: id } })
            .then( resp =>{
                if( resp === 1 ) {
                    return res.status(200).json({
                        ok:true,
                        alumnoBorrado: resp
                });
                } else {
                    return res.status(500).json({
                        ok: false,
                        mensaje: `No se pudo borrar el alumno, con el Id: ${id}` 
                        }); 
                }

            })
            .catch( err => {
                return res.status(500).json({
                    ok:false,
                    mensaje: 'No se pudo borrar el alumno',
                    errors: err
                });
            });
});

module.exports = app;

