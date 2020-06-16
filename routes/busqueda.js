//============================================================================
// Requires
//============================================================================
const express = require('express');
const Sequelize = require('sequelize');
const config    = require('../config/setting').CONFIG;

//============================================================================
// Importar modelo del empresa
//============================================================================
const sequelize = new Sequelize(config);
const empresa = require('../models/empresas')(sequelize, Sequelize.DataTypes);
const alumno = require('../models/alumnos')(sequelize, Sequelize.DataTypes);
const acuerdo = require('../models/acuerdos')(sequelize, Sequelize.DataTypes);
const convenio = require('../models/convenios')(sequelize, Sequelize.DataTypes);
const personal = require('../models/personales')(sequelize, Sequelize.DataTypes);
const usuario = require('../models/usuarios')(sequelize, Sequelize.DataTypes);

//============================================================================
// Inicializar variables
//============================================================================
var app = express();

//============================================================================
// Busqueda general - simultánea
//============================================================================
app.get('/todo/:busqueda', (req, res) => {  

    const busqueda  = `${req.params.busqueda}`;

    Promise.all( [searchCompanies(busqueda), 
                  searchStudents(busqueda),
                  searchAgreements(busqueda),
                  searchPersonals(busqueda),
                  searchUsers(busqueda),
                  searchConvenios(busqueda)
                ])
    .then( respuestas => {
        res.status(200).json({
            ok: true,
            empresas  : respuestas[0],
            alumnos   : respuestas[1],
            acuerdos  : respuestas[2],
            personal  : respuestas[3],
            usuarios  : respuestas[4],
            convenios : respuestas[5]            
        })
    .catch(err => res.status(500).json({ ok:false, errors: err }));
    });
});
//============================================================================
// END - Busqueda general - simultánea
//============================================================================
//============================================================================
// Buscar por colección
//============================================================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    const busqueda  = req.params.busqueda;
    const tabla     = req.params.tabla;
    const atributo  = 'nombre';

    searchAll(tabla, busqueda, atributo)
        .then(resp => res.status(200).json({ ok:true, busqueda: resp}))
        .catch( err => res.status(500).json({ ok:false, erros:err }));
});
//============================================================================
// END - Buscar por colección
//============================================================================



function searchCompanies( busqueda ) {
    return sequelize.query(`SELECT * FROM empresas WHERE nombre ILIKE '%${busqueda}%'`,
            { type: Sequelize.QueryTypes.SELECT})
                .then(empresasDB => empresasDB);                 
            }  

function searchStudents( busqueda ) {
   return sequelize.query(`SELECT * FROM alumnos WHERE nombre ILIKE '%${busqueda}%'`,
            { type: Sequelize.QueryTypes.SELECT})
                .then(alumnosDB => alumnosDB);                 
}             

function searchPersonals( busqueda ) {
   return sequelize.query(`SELECT * FROM personales WHERE nombre ILIKE '%${busqueda}%'`,
            { type: Sequelize.QueryTypes.SELECT})
                .then(personalDB => personalDB);                 
}    

function searchUsers( busqueda ) {
   return sequelize.query(`SELECT * FROM usuarios WHERE nombre ILIKE '%${busqueda}%'`,
            { type: Sequelize.QueryTypes.SELECT})
                .then(userDB => userDB);                 
}             

function searchAgreements( busqueda ) {
   return sequelize.query(`SELECT * FROM acuerdos WHERE nombre ILIKE '%${busqueda}%'`,
            { type: Sequelize.QueryTypes.SELECT})
                .then(acuerdoDB => acuerdoDB);                 
}    

function searchConvenios( busqueda ) {
   return sequelize.query(`SELECT * FROM convenios WHERE nombre ILIKE '%${busqueda}%'`,
            { type: Sequelize.QueryTypes.SELECT})
                .then(convenioDB => convenioDB);                 
} 
//============================================================================
//  Función - Busqueda por colección - centralizada
//============================================================================
function searchAll( entidad, busqueda, atributo) {
   return sequelize.query(`SELECT * FROM ${entidad} WHERE ${atributo} ILIKE '%${busqueda}%'`,
            { type: Sequelize.QueryTypes.SELECT})
                .then(respDB => respDB);                 
}



module.exports = app;

