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
const usuarioRoutes = require('./routes/usuario.route');
const loginRoutes = require('./routes/login.route');
const empresaRoutes = require('./routes/empresa.route');
const alumnoRoutes = require('./routes/alumno.route');
const empleadoRoutes = require('./routes/empleado.route');




//============================================================================
// Rutas - Middleware
//============================================================================
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/empresa', empresaRoutes);
app.use('/alumno', alumnoRoutes);
app.use('/empleado', empleadoRoutes);
app.use('/', appRoutes);


//============================================================================
// Escuchando del puerto
//============================================================================
server.start( () => {} );