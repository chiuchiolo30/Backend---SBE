/*jshint esversion: 6 */ 

// Empresa

// =================================
//	Requires
// =================================
const express = require('express');

const mdAutenticacion = require('../middleware/autenticacion');


const app     = express();
// Importamos el esquema del hospital
const Empresa = require('../models/empresa.model');

// =============================================================================
// Obtener todas las empresas -> OK
// =============================================================================

app.get('/', (req, res, next ) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Empresa.find({})
            .skip(desde)
            .limit(5)
            .populate('usuario', 'nombre email')
            .exec(        
                (err, empresas ) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando empresa',
                        errors: err
                    });
                }
                Empresa.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        empresas: empresas,
                        total: conteo
                    });
                });

            });

});

// ==========================================
// Obtener Empresa por ID -> ok
// ==========================================
app.get('/:id', (req, res) => {
    const id = req.params.id;
    Empresa.findById(id)
                .populate('usuario', 'nombre img email')
                .exec((err, empresa) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al buscar empresa',
                            errors: err
                            });
                    }
                    if (!empresa) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: `La empresa con el id ${id} no existe`,
                            errors: { message: 'No existe una empresa con ese ID' }
                            });
                    }

                    res.status(200).json({
                        ok: true,
                        empresa: empresa
                        });
                });
            });




//============================================================================
// Actualizar empresa -> ok
//============================================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Empresa.findById( id, (err, empresa) => {


           if ( err ) {
                return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar empresa',
                        errors: err
                });
           }
           if ( !empresa ) {
                return res.status(400).json({
                        ok: false ,
                        mensaje: 'La empresa con el id '+ id + ' no existe',
                        errors: { message: 'No existe una empresa con ese ID' }
                 });
           }

           empresa.nombre = body.nombre;
           empresa.usuario = req.usuario._id;

           empresa.save( (err, empresaGuardado) => {
            
                if ( err ) {
                    return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar la empresa',
                            errors: err
                    });
                }


                res.status(200).json({
                    ok: true,
                    empresa: empresaGuardado
                });
           });
    });           
});



// =============================================================================
// Crear una nueva Empresa -> ok
// =============================================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    const body = req.body;

    const empresa = new Empresa({
       nombre   : body.nombre,
       direccion   : body.direccion,
       cuit   : body.cuit,
       usuario  : req.usuario._id
    });

    empresa.save( ( err, empresaGuardado )=> {
        
        if ( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear empresa',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            empresa: empresaGuardado
            
        });
    });


});

//============================================================================
// Borrar una empresa por el id -> ok
//============================================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    const id = req.params.id;

    Empresa.findByIdAndRemove(id, ( err, empresaBorrado ) =>{

        if ( err ) {
            return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al borrar empresa',
                        errors: err
                    });
        }
        if ( !empresaBorrado ) {
                return res.status(400).json({
                            ok: false,
                            mensaje: 'No existe una empresa con el id: ' + id + '',
                            errors: { message: 'No existe una empresa con el id: ' + id + ''}
                });
        }
        res.status(200).json({
            ok: true,
            empresa: empresaBorrado
        });
    });

});

module.exports = app;