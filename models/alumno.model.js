const mongoose =	require('mongoose');
const Schema   =	mongoose.Schema;

const alumnoSchema = new Schema({
                persona   : {	type: Schema.Types.ObjectId, ref: 'Persona' },
				libreta   : {	type: String,	required: [true,	'El número de libreta es necesario']	},
				carrera   : {	type: String,	required: [true,	'La carrera es necesaria']	},
				img       : {	type: String,	required: false } },
				{ collection: 'alumnos'});

module.exports =	mongoose.model('Alumno', alumnoSchema);