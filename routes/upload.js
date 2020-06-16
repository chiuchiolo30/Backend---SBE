//============================================================================
// Requires
//============================================================================
const express = require('express');
const Sequelize = require('sequelize');
const config    = require('../config/setting').CONFIG;
const fileUpload = require('express-fileupload');
const fs    = require('fs');

const sequelize = new Sequelize(config);

const empresa = require('../models/empresas')(sequelize, Sequelize.DataTypes);
const alumno = require('../models/alumnos')(sequelize, Sequelize.DataTypes);
const personal = require('../models/personales')(sequelize, Sequelize.DataTypes);
const usuario = require('../models/usuarios')(sequelize, Sequelize.DataTypes);


//============================================================================
// Inicialización de variables
//============================================================================
const app = express();

//============================================================================
// Middleware - default options
//============================================================================
app.use(fileUpload());

app.put('/:tipo/:id', (req, res) => {

    const tipo = req.params.tipo;
    const id   = req.params.id;

    // tipos de colección
    const tiposValidos = ['usuarios', 'alumnos', 'empresas', 'personal'];
    if ( tiposValidos.indexOf( tipo ) < 0 ) {
        return res.status(400).json({
            ok:false,
            mensaje: 'El tipo de colección no es válida',
            errors: {message: 'El tipo de colección no es válida'}
        });
    }

    if( !req.files ) {
        return res.status(400).json({
            ok:false,
            mensaje: 'Error cargando archivo',
            errors: {message: 'Debe de seleccionar una imagen'}
        });
    }

    // Obtener nombre del archivo
    const archivo = req.files.imagen;
    const nombreCortado = archivo.name.split('.');
    const extencionArchivo = nombreCortado[ nombreCortado.length - 1 ];

    // Solo estas extensiones aceptamos
    const extensionesValidas = ['png','jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extencionArchivo) < 0 ) {
        return res.status(400).json({
            ok:false,
            mensaje: 'Extensión no válida',
            errors: {message: 'Las extensiones validas son: ' + extensionesValidas.join(', ')}
        });
    }
    // Nombre de archivo personalizado
    const nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extencionArchivo }`;
    
    // Mover el archivo del temporal a un path específico 
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv( path, err => {
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo( tipo, id, nombreArchivo, res );
        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'archivo movido correctamente',
        //     extencionArchivo: extencionArchivo
        // });
    });


});

// revisar que no venga un id nulo
function subirPorTipo( tipo, id, nombreArchivo,res ) {

    if ( tipo === 'usuarios' ) {
        usuario.findByPk(id)                 
                 .then(userDB => {
                    const pathViejo = `./uploads/usuarios/${userDB.img}`;
                    // si existe, elimina la imagen anterior.
                    if ( fs.existsSync(pathViejo)) fs.unlinkSync( pathViejo );    
                    userDB.img = nombreArchivo;
                    userDB.save().then( userUpdate => {
                       return res.status(200).json({
                                ok:true,
                                userUpdate: userUpdate
                         });
                     });
                 });              
    }
    if ( tipo === 'alumnos' ) {
        alumno.findByPk(id)                 
                 .then(studentDB => {
                    let pathViejo = `./uploads/alumnos/${studentDB.img}`;
                    // si existe, elimina la imagen anterior.
                    if ( fs.existsSync(pathViejo)) fs.unlinkSync( pathViejo );    
                    studentDB.img = nombreArchivo;
                    studentDB.save().then( studentUpdate => {
                       return res.status(200).json({
                                ok:true,
                                studentUpdate: studentUpdate
                         });
                     });
                 }); 
    }
    if ( tipo === 'personal' ) {
        personal.findByPk(id)                 
                 .then(personalDB => {
                    let pathViejo = `./uploads/personal/${personalDB.img}`;
                    // si existe, elimina la imagen anterior.
                    if ( fs.existsSync(pathViejo)) fs.unlinkSync( pathViejo );    
                    personalDB.img = nombreArchivo;
                    personalDB.save().then( personalUpdate => {
                       return res.status(200).json({
                                ok:true,
                                personalUpdate: personalUpdate
                         });
                     });
                 }); 
    }
    if ( tipo === 'empresas' ) {
        empresa.findByPk(id)                 
                 .then(empresaDB => {
                    let pathViejo = `./uploads/empresas/${empresaDB.img}`;
                    // si existe, elimina la imagen anterior.
                    if ( fs.existsSync(pathViejo)) fs.unlinkSync( pathViejo );    
                    empresaDB.img = nombreArchivo;
                    empresaDB.save().then( empresaUpdate => {
                       return res.status(200).json({
                                ok:true,
                                empresaUpdate: empresaUpdate
                         });
                     });
                 }); 
    }
}

module.exports = app;