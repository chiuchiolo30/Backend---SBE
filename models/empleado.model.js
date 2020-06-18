const mongoose =	require('mongoose');
const Schema   =	mongoose.Schema;

const empleadoSchema = new Schema({
                persona   : {	type: Schema.Types.ObjectId, ref: 'Persona' },
				cargo     : {	type: String,	required: [true,	'El cargo es necesario']	},
				alta      : {	type: Boolean, default: true },
				img       : {	type: String,	required: false } },
				{ collection: 'empleados'});

module.exports =	mongoose.model('Empleado', empleadoSchema);