
const jwt = require('jsonwebtoken');
const SEED    = require('../config/setting').SEED;


//============================================================================
// Verificar token - middleware
//============================================================================    

exports.verificaToken = (req, res, next) => {

    const token = req.query.token;

    jwt.verify( token, SEED, (err, decoded) => {
            
        if (err) {
            return res.status(401).json({
                ok:false,
                mensaje: 'Token no válido',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        next();  

    });

};

    
    

