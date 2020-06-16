//============================================================================
// Requires
//============================================================================
const express   = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const config    = require('./config/setting').CONFIG;



//============================================================================
// inicializar variables
//============================================================================
const app = express();
const sequelize = new Sequelize(config);

//============================================================================
// CORS
//============================================================================
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });
//============================================================================
// Body Parser - parse application/x-www-form-urlencoded
//============================================================================
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//============================================================================
// Importar rutas
//============================================================================
const appRoutes = require('./routes/app');
const alumnoRoutes = require('./routes/alumno');
const acuerdoRoutes = require('./routes/acuerdo');
const convenioRoutes = require('./routes/convenio');
const empresaRoutes = require('./routes/empresa');
const personalRoutes = require('./routes/personal');
const usuarioRoutes = require('./routes/usuario');
const busquedaRoutes = require('./routes/busqueda');
const loginRoutes = require('./routes/login');
const uploadRoutes = require('./routes/upload');
const imagenesRoutes = require('./routes/imagenes');

//============================================================================
// Conexión a la DB
//============================================================================
sequelize.authenticate()
.then(() => {
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'ONLINE');        
})
.catch(err => {
    console.log('Base de datos: \x1b[31m%s\x1b[0m', 'OOFLINE');        
});


//============================================================================
// Rutas -Middleware
//============================================================================
app.use('/alumnos', alumnoRoutes);
app.use('/empresa', empresaRoutes);
app.use('/personal', personalRoutes);
app.use('/acuerdo', acuerdoRoutes);
app.use('/convenio', convenioRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/login', loginRoutes);
app.use('/uploads', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);

//============================================================================
// Escuchar peticiones
//============================================================================
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'ONLINE');    
});