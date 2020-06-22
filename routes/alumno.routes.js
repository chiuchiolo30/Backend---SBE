/*jshint esversion: 6 */ 

// =================================
//	            Alumno
// =================================    
// =================================
//	            Requires
// =================================
const express         = require('express');
const mdAutenticacion = require('../middleware/autenticacion');
const Persona         = require('../models/persona.model');
const Alumno          = require('../models/alumno.model');



const app     = express();

// =============================================================================
// Obtener todos los alumnos -> OK
// =============================================================================

app.get('/', (req, res, next ) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Alumno.find({})
            .skip(desde)
            .limit(5)
            .populate('datosPersonales', 'nombre email')
            .exec(        
                (err, alumnos ) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando alumno',
                        errors: err
                    });
                }
                Alumno.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        alumnos: alumnos,
                        total: conteo
                    });
                });

            });

});

// ==========================================
// Obtener Alumno por ID
// ==========================================
app.get('/:id', (req, res) => {
    const id = req.params.id;
    Alumno.findById(id)
                .populate('datosPersonales', 'nombre email')
                .exec((err, alumno) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al buscar alumno',
                            errors: err
                            });
                    }
                    if (!alumno) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: `El alumno con el id ${id} no existe`,
                            errors: { message: 'No existe un alumno con ese ID' }
                            });
                    }

                    res.status(200).json({
                        ok: true,
                        alumno: alumno
                        });
                });
            });




//============================================================================
// Actualizar Alumno
//============================================================================
app.put('/:id',  (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Alumno.findById( id, (err, alumno) => {


           if ( err ) {
                return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar alumno',
                        errors: err
                });
           }
           if ( !alumno ) {
                return res.status(400).json({
                        ok: false ,
                        mensaje: 'El alumno con el id '+ id + ' no existe',
                        errors: { message: 'No existe un alumno con ese ID' }
                 });
           }
           alumno.libreta = body.libreta;
           alumno.carrera = body.carrera;
           buscarDatos(alumno.datosPersonales._id)
                .then( respuesta => {
                    respuesta.nombre = body.nombre;
                    respuesta.direccion = body.direccion;
                    respuesta.email = body.email;
                    respuesta.dni = body.dni;
                    respuesta.telefono = body.telefono;
                    respuesta.save( (err, datosGuardado) => {
                        if ( err ) {
                            return res.status(400).json({
                                    ok: false,
                                    mensaje: 'Error al actualizar los datos',
                                    errors: err
                            });
                        }        
                    });                    
                });      
           alumno.save( (err, alumnoGuardado) => {            
                if ( err ) {
                    return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar el alumno',
                            errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    alumno: alumnoGuardado
                });
           });
    });           
});



// =============================================================================
// Crear un nuevo alumno -> OK
// =============================================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    const body = req.body;
    const datos = new Persona({
        nombre : body.nombre,
        direccion : body.direccion,
        email : body.email,
        dni : body.dni,
        telefono : body.telefono
    });
    const alumno = new Alumno({
       datosPersonales   : datos,
       libreta           : body.libreta,
       carrera           : body.carrera,
       img               : body.img
    });

    datos.save( (err, datosGuardado) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al guardar los datos',
                errors: err
            });
        } else {

            alumno.save( ( err, alumnoGuardado )=> {
                
                if ( err ) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al crear alumno',
                        errors: err
                    });
                }
        
                res.status(201).json({
                    ok: true,
                    alumno: alumnoGuardado,
                    usuarioToken: req.usuario
                    
                });
            });
        }
    });



});

//============================================================================
// Borrar un alumno por el id -> OK - fisicamente
//============================================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    const id = req.params.id;

    Alumno.findByIdAndRemove(id, ( err, alumnoBorrado ) =>{

        if ( err ) {
            return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al borrar alumno',
                        errors: err
                    });
        }
        if ( !alumnoBorrado ) {
                return res.status(400).json({
                            ok: false,
                            mensaje: 'No existe un alumno con el id: ' + id + '',
                            errors: { message: 'No existe un alumno con el id: ' + id + ''}
                });
        } else {
            borrarDatos(alumnoBorrado.datosPersonales._id)
                .then(respuesta => {});
        }

        res.status(200).json({
            ok: true,
            alumno: alumnoBorrado
        });
    });

});

// ====================================================
//	Función para borrar un registro de datos personales
// ====================================================
function borrarDatos(id) {
    return new Promise( (resolve, reject) => {
        Persona.findByIdAndRemove( id, ( err, personaBorrado ) => {
            if ( err || !personaBorrado ) {
                error = err || !personaBorrado;
                reject('Error al borrar datos', error);
            } else {
                resolve(personaBorrado);
            }
           
        });
    });
}
// ====================================================
//	Función para buscar un registro de datos personales 
// ====================================================
function buscarDatos(id) {
    return new Promise( (resolve, reject) => {
        Persona.findById(id, (err, persona) => {
            if (err) {
                reject('Error al buscar datos', err);
            } else {
                resolve(persona);
            }
        });
    });
}

module.exports = app;