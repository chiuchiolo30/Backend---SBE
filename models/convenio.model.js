const mongoose =	require('mongoose');
const Schema   =	mongoose.Schema;

const convenioSchema = new Schema({
				nombre            : {	type: String,	required: [true,	'El	nombre es necesario']	},
				inicio            : {	type: String,	required: [true,	'La fecha de inicio es necesaria']	},
				fin               : {	type: String,	required: [true,	'La fecha de finalización es necesaria']	},
				numeroAcuerdo     : [{  type: Schema.Types.ObjectId, ref: 'Acuerdo'}],
                numeroExpediente  : {	type: Number,   required: [true,	'El	número de expediente es necesario'] },
                tipoConvenio      : {	type: String,   default: 'pasante' },
                empresa           : {   type: Schema.Types.ObjectId, ref: 'Empresa'},
                empleados         : {	type: Schema.Types.ObjectId, ref: 'Empleado' }
             },
				{ collection: 'convenios'});

module.exports =	mongoose.model('Convenio', convenioSchema);
