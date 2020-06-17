// =================================
//	           Requires
// =================================
const express = require("express");
const bodyParser = require('body-parser');

// =================================
//	           Clase
// =================================   
class Server {
    constructor(puerto) {
        this.port = puerto;
        this.app = express();
    }
    /* Método estático, inicia el servidor */
    static init(puerto) { return new Server(puerto); }

    /* Método para escuchar el servidor en el puerto: port */
    start(callback) {
        this.app.listen(this.port, callback);
        console.log(`Servidor corriendo en el puerto: \x1b[36m%s\x1b[0m`, this.port, `\x1b[32m`, 'ONLINE \x1b[0m');
    } 
    /* Método para habilitar el CORS */  
    cors() {
        this.app.use(function(req, res, next) {
            res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
            res.header('Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
            res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
          });
    }

    /* Método para el body parser - parse application/x-www-form-urlencoded */
    bodyParser() {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
    }
}

exports.default = Server;