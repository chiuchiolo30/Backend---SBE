const express = require('express');

app = express();

app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realiza correctamente'
    });
});

module.exports = app;