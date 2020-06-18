const mongoose =	require('mongoose');
const Schema   =	mongoose.Schema;

const personaSchema = new Schema({
				nombre    : {	type: String,	required: [true,	'El	nombre es necesario']	},
				direccion : {	type: String,	required: [true,	'La dirección es necesaria']	},
				email     : {	type: String,	required: [true,	'El	email es necesario']	},
				dni       : {	type: Number,	required: [true,	'El	DNI es necesario'] },
				telefono  : {	type: Number,   required: [true,	'El	telefono es necesario'] } },
				{ collection: 'personas'});

module.exports =	mongoose.model('Persona', personaSchema);