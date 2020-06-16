//============================================================================
// Requires
//============================================================================
const express = require('express');
const Sequelize = require('sequelize');
const config    = require('../config/setting').CONFIG;
const path = require('path');
const fs = require('fs');

const sequelize = new Sequelize(config);

//============================================================================
// Instancias 
//============================================================================
const app = express();

app.get('/:tipo/:img', (req, res) => {

    const tipo = req.params.tipo;
    const img = req.params.img;

    var pathImagen = path.resolve( __dirname, `../uploads/${ tipo }/${ img }`);

    if( fs.existsSync( pathImagen )) {
        res.sendFile( pathImagen );
    } else {
        var pathNoImagen = path.resolve( __dirname, '../assets/no-img.jpg');
        res.sendFile( pathNoImagen );
    }
});

module.exports = app;