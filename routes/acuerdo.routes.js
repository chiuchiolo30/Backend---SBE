/*jshint esversion: 6 */ 

// =================================
//	            Acuerdo
// =================================    
// =================================
//	            Requires
// =================================
const express         = require('express');
const mdAutenticacion = require('../middleware/autenticacion');
const Acuerdo        = require('../models/acuerdo.model');



const app     = express();

// =============================================================================
// Obtener todos los acuerdos -> OK
// =============================================================================

app.get('/', (req, res, next ) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Acuerdo.find({})
            .skip(desde)
            .limit(5)
            .populate('usuario' ,  'nombre email')            
            .exec(        
                (err, acuerdos ) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando acuerdo',
                        errors: err
                    });
                }
                Acuerdo.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        acuerdos: acuerdos,
                        total: conteo
                    });
                });

            });

});

// ==========================================
// Obtener Acuerdo por ID -> OK
// ==========================================
app.get('/:id', (req, res) => {
    const id = req.params.id;
    Acuerdo.findById(id)
                .populate('usuario', 'nombre email')
                .exec((err, acuerdo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al buscar acuerdo',
                            errors: err
                            });
                    }
                    if (!acuerdo) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: `El acuerdo con el id ${id} no existe`,
                            errors: { message: 'No existe un acuerdo con ese ID' }
                            });
                    }

                    res.status(200).json({
                        ok: true,
                        acuerdo: acuerdo
                        });
                });
            });




//============================================================================
// Actualizar Acuerdo -> OK
//============================================================================
app.put('/:id',  (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Acuerdo.findById( id, (err, acuerdo) => {


           if ( err ) {
                return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar acuerdo',
                        errors: err
                });
           }
           if ( !acuerdo ) {
                return res.status(400).json({
                        ok: false ,
                        mensaje: 'El acuerdo con el id '+ id + ' no existe',
                        errors: { message: 'No existe un acuerdo con ese ID' }
                 });
           }
           acuerdo.nombre           = body.nombre;
           acuerdo.inicio           = body.inicio;
           acuerdo.fin              = body.fin;
           caracteristicas          = body.caracteristicas;
           observaciones            = body.observaciones;
           acuerdo.numeroExpediente = body.numeroExpediente;
           obraSocial               = body.obraSocial;
           art                      = body.art;
              
           acuerdo.save( (err, acuerdoGuardado) => {            
                if ( err ) {
                    return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar el acuerdo',
                            errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    acuerdo: acuerdoGuardado
                });
           });
    });           
});



// =============================================================================
// Crear un nuevo acuerdo -> OK
// =============================================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    const body = req.body;    
    const acuerdo = new Acuerdo({
       nombre             : body.nombre,
       areaDeTrabajo      : body.areaDeTrabajo,
       asignacionMensual  : body.asignacionMensual,
       obraSocial         : body.obraSocial,
       art                : body.art,
       numeroExpediente   : body.numeroExpediente,
       inicio             : body.inicio,
       fin                : body.fin,
       caracteristicas    : body.caracteristicas,       
       observaciones      : body.observaciones,
       empleado           : body.empleado,
       convenio           : body.convenio,
       usuario            : req.usuario._id
       
    });

   

    acuerdo.save( ( err, acuerdoGuardado )=> {
        
        if ( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear acuerdo',
                errors: err
            });
        }
    
        res.status(201).json({
            ok: true,
            acuerdo: acuerdoGuardado,
            usuarioToken: req.usuario
            
        });
    });
  



});

//============================================================================
// Borrar un acuerdo por el id -> OK - fisicamente
//============================================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    const id = req.params.id;

    Acuerdo.findByIdAndRemove(id, ( err, acuerdoBorrado ) =>{

        if ( err ) {
            return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al borrar acuerdo',
                        errors: err
                    });
        }
        if ( !acuerdoBorrado ) {
                return res.status(400).json({
                            ok: false,
                            mensaje: 'No existe un acuerdo con el id: ' + id + '',
                            errors: { message: 'No existe un acuerdo con el id: ' + id + ''}
                });
        }

        res.status(200).json({
            ok: true,
            acuerdo: acuerdoBorrado
        });
    });

});


module.exports = app;