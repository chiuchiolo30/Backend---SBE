const mongoose =	require('mongoose');
const Schema   =	mongoose.Schema;

const empresaSchema = new Schema({
				nombre    : {	type: String,	required: [true,	'El	nombre es necesario']	},
				direccion : {	type: String,	required: [true,	'La dirección es necesaria']	},
				cuit      : {	type: String,	required: [true,	'El	CUIT es	necesario']	},
				img       : {	type: String,	required: false },
				empleados : [{	type: Schema.Types.ObjectId, ref: 'Empleado' }],
				convenios : [{	type: Schema.Types.ObjectId, ref: 'Convenio' }],
				usuario   : {	type: Schema.Types.ObjectId, ref: 'Usuario' }
			},
			{ collection: 'empresas'});

module.exports =	mongoose.model('Empresa', empresaSchema);