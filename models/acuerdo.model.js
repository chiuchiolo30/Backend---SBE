const mongoose =	require('mongoose');
const Schema   =	mongoose.Schema;

const acuerdoSchema = new Schema({
				nombre    : {	type: String,	required: [true,	'El	nombre es necesario']	},
				areaDeTrabajo : {	type: String,	required: [true,	'El area de trabajo es necesaria']	},
				asignacionMensual      : {	type: Number,	required: [true,	'La asignación mensual es necesaria']	},
				obraSocial       : {	type: String,	required: false },
				art : {	type: String, required: [ true,'La ART es necesaria'] },
				numeroExpediente : {	type: Number, required: [true, 'El número de expediente es necesario'] },
				inicio : {	type: String, required: [ true, 'La fecha de inicio es necesaria'] },
				fin : {	type: String, required: [ true, 'La fecha de finalización es necesaría'] },
				caracteristicas : {	type: String },
				observaciones : {	type: String },
				empleado : {	type: Schema.Types.ObjectId, ref: 'Empleado' },
				convenio : {	type: Schema.Types.ObjectId, ref: 'Convenio' },
				usuario   : {	type: Schema.Types.ObjectId, ref: 'Usuario' }
			},
			{ collection: 'acuerdos'});

module.exports =	mongoose.model('Acuerdo', acuerdoSchema);