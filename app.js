//============================================================================
// Requires
//============================================================================
const Server = require('./server/server');
const DB     = require('./database/mongodb');



//============================================================================
// Iniciar el servidor Express
//============================================================================
const server = Server.default.init( 3000 );
const app = server.app;
//============================================================================
// Habilitar CORS
//============================================================================
server.cors();

//============================================================================
// Body Parser - parse application/x-www-form-urlencoded
//============================================================================
server.bodyParser();

//============================================================================
// Conexión a la DB
//============================================================================
const db = DB.default.init('SBE',27017);
db.conectarDB();

//============================================================================
// Importar rutas
//============================================================================
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario.routes');
const loginRoutes = require('./routes/login.routes');
const empresaRoutes = require('./routes/empresa.routes');
const alumnoRoutes = require('./routes/alumno.routes');
const empleadoRoutes = require('./routes/empleado.routes');
const convenioRoutes = require('./routes/convenio.routes');
const acuerdoRoutes = require('./routes/acuerdo.routes');




//============================================================================
// Rutas - Middleware
//============================================================================
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/empresa', empresaRoutes);
app.use('/alumno', alumnoRoutes);
app.use('/empleado', empleadoRoutes);
app.use('/convenio', convenioRoutes);
app.use('/acuerdo', acuerdoRoutes);
app.use('/', appRoutes);


//============================================================================
// Escuchando del puerto
//============================================================================
server.start( () => {} );