/*jshint esversion: 6 */ 

// =================================
//	            Empleado
// =================================    
// =================================
//	            Requires
// =================================
const express         = require('express');
const mdAutenticacion = require('../middleware/autenticacion');
const Persona         = require('../models/persona.model');
const Empleado        = require('../models/empleado.model');



const app     = express();

// =============================================================================
// Obtener todos los empleados -> OK
// =============================================================================

app.get('/', (req, res, next ) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Empleado.find({})
            .skip(desde)
            .limit(5)
            .populate('datosPersonales', 'nombre email')
            .exec(        
                (err, empleados ) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando empleado',
                        errors: err
                    });
                }
                Empleado.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        empleados: empleados,
                        total: conteo
                    });
                });

            });

});

// ==========================================
// Obtener Empleado por ID
// ==========================================
app.get('/:id', (req, res) => {
    const id = req.params.id;
    Empleado.findById(id)
                .populate('datosPersonales', 'nombre email')
                .exec((err, empleado) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al buscar empleado',
                            errors: err
                            });
                    }
                    if (!empleado) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: `El empleado con el id ${id} no existe`,
                            errors: { message: 'No existe un empleado con ese ID' }
                            });
                    }

                    res.status(200).json({
                        ok: true,
                        empleado: empleado
                        });
                });
            });




//============================================================================
// Actualizar Empleado
//============================================================================
app.put('/:id',  (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Empleado.findById( id, (err, empleado) => {


           if ( err ) {
                return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar empleado',
                        errors: err
                });
           }
           if ( !empleado ) {
                return res.status(400).json({
                        ok: false ,
                        mensaje: 'El empleado con el id '+ id + ' no existe',
                        errors: { message: 'No existe un empleado con ese ID' }
                 });
           }
           empleado.cargo = body.cargo;
           buscarDatos(empleado.datosPersonales._id)
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
           empleado.save( (err, empleadoGuardado) => {            
                if ( err ) {
                    return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar el empleado',
                            errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    empleado: empleadoGuardado
                });
           });
    });           
});



// =============================================================================
// Crear un nuevo empleado -> OK
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
    const empleado = new Empleado({
       datosPersonales   : datos,
       cargo             : body.cargo,
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

            empleado.save( ( err, empleadoGuardado )=> {
                
                if ( err ) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al crear empleado',
                        errors: err
                    });
                }
        
                res.status(201).json({
                    ok: true,
                    empleado: empleadoGuardado,
                    usuarioToken: req.usuario
                    
                });
            });
        }
    });



});

//============================================================================
// Borrar un empleado por el id -> OK - fisicamente
//============================================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    const id = req.params.id;

    Empleado.findByIdAndRemove(id, ( err, empleadoBorrado ) =>{

        if ( err ) {
            return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al borrar empleado',
                        errors: err
                    });
        }
        if ( !empleadoBorrado ) {
                return res.status(400).json({
                            ok: false,
                            mensaje: 'No existe un empleado con el id: ' + id + '',
                            errors: { message: 'No existe un empleado con el id: ' + id + ''}
                });
        } else {
            borrarDatos(empleadoBorrado.datosPersonales._id)
                .then(respuesta => {});
        }

        res.status(200).json({
            ok: true,
            empleado: empleadoBorrado
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