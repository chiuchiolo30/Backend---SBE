const mongoose =	require('mongoose');
const datos  =	require('./persona.model');
const Schema   =	mongoose.Schema;

const alumnoSchema = new Schema({
                datosPersonales   : {type: Schema.Types.ObjectId, ref: 'Persona'},
				libreta   		  : {	type: String,	required: [true,	'El número de libreta es necesario']	},
				carrera   		  : {	type: String,	required: [true,	'La carrera es necesaria']	},
				img       		  : {	type: String,	required: false },
				alta: { type: Boolean, default: true } },				
				{ collection: 'alumnos'});

module.exports =	mongoose.model('Alumno', alumnoSchema);