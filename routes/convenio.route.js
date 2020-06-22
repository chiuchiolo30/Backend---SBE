/*jshint esversion: 6 */ 

// =================================
//	            Convenio
// =================================    
// =================================
//	            Requires
// =================================
const express         = require('express');
const mdAutenticacion = require('../middleware/autenticacion');
const Persona         = require('../models/persona.model');
const Convenio        = require('../models/convenio.model');



const app     = express();

// =============================================================================
// Obtener todos los convenios -> OK
// =============================================================================

app.get('/', (req, res, next ) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Convenio.find({})
            .skip(desde)
            .limit(5)
            .populate('usuario', 'nombre email')
            .exec(        
                (err, convenios ) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando convenio',
                        errors: err
                    });
                }
                Convenio.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        convenios: convenios,
                        total: conteo
                    });
                });

            });

});

// ==========================================
// Obtener Convenio por ID
// ==========================================
app.get('/:id', (req, res) => {
    const id = req.params.id;
    Convenio.findById(id)
                .populate('usuario', 'nombre email')
                .exec((err, convenio) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al buscar convenio',
                            errors: err
                            });
                    }
                    if (!convenio) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: `El convenio con el id ${id} no existe`,
                            errors: { message: 'No existe un convenio con ese ID' }
                            });
                    }

                    res.status(200).json({
                        ok: true,
                        convenio: convenio
                        });
                });
            });




//============================================================================
// Actualizar Convenio
//============================================================================
app.put('/:id',  (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Convenio.findById( id, (err, convenio) => {


           if ( err ) {
                return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar convenio',
                        errors: err
                });
           }
           if ( !convenio ) {
                return res.status(400).json({
                        ok: false ,
                        mensaje: 'El convenio con el id '+ id + ' no existe',
                        errors: { message: 'No existe un convenio con ese ID' }
                 });
           }
           convenio.nombre = body.nombre;
           convenio.inicio = body.inicio;
           convenio.fin = body.fin;
           convenio.numeroExpediente = body.numeroExpediente;
              
           convenio.save( (err, convenioGuardado) => {            
                if ( err ) {
                    return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar el convenio',
                            errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    convenio: convenioGuardado
                });
           });
    });           
});



// =============================================================================
// Crear un nuevo convenio -> OK
// =============================================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    const body = req.body;    
    const convenio = new Convenio({
       nombre               : body.nombre,
       inicio               : body.inicio,
       fin                  : body.fin,
       numeroExpediente     : body.numeroExpediente,
       tipoConvenio         : body.tipoConvenio,
       empresa              : body.empresa,
       empleado             : body.empleado,
       usuario              : req.usuario._id
       
    });

   

    convenio.save( ( err, convenioGuardado )=> {
        
        if ( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear convenio',
                errors: err
            });
        }
    
        res.status(201).json({
            ok: true,
            convenio: convenioGuardado,
            usuarioToken: req.usuario
            
        });
    });
  



});

//============================================================================
// Borrar un convenio por el id -> OK - fisicamente
//============================================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    const id = req.params.id;

    Convenio.findByIdAndRemove(id, ( err, convenioBorrado ) =>{

        if ( err ) {
            return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al borrar convenio',
                        errors: err
                    });
        }
        if ( !convenioBorrado ) {
                return res.status(400).json({
                            ok: false,
                            mensaje: 'No existe un convenio con el id: ' + id + '',
                            errors: { message: 'No existe un convenio con el id: ' + id + ''}
                });
        }

        res.status(200).json({
            ok: true,
            convenio: convenioBorrado
        });
    });

});


module.exports = app;