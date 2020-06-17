// =================================
//	        Requires
// =================================
const db = require('mongoose');

// =================================
//	        Clase
// =================================
class MongoDB {
    constructor(nombreBD, puerto) {
        this.nameDB  = nombreBD;
        this.port    = puerto;
        this.mongoose = db;

    }
    /* Método estático para iniciar Mongoose */
    static init(nombreBD, puerto) { return new MongoDB(nombreBD, puerto);}
    
    /* Método para conectar a la BD */
   async conectarDB() {
        const db_ = this.mongoose.connection;
        try {            
            /* inicia la conexión a la DB */
            await this.mongoose.connect(`mongodb://localhost:${this.port}/${this.nameDB}`,
                    { 
                      useNewUrlParser: true,
                      useUnifiedTopology: true,
                      useCreateIndex: true,
                      useFindAndModify: false
                    });
            console.log(`Base de datos: \x1b[36m%s\x1b[0m`, this.nameDB, `\x1b[32m`, 'ONLINE');
        } catch (error) {
            handleError(error);
        }       
    }

}

exports.default = MongoDB;
