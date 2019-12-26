'use-strict'

const Mongoose = require('mongoose');

var bookingSchema = new Mongoose.Schema({ 
	bookingName:{
		type: String,
		required: true
	},
	bookingDate: {
		type: Date,
		required: true
	},
	startTime: {
		type: String,
		required: true
	},
	endTime: {
		type: String,
		required: true
	},
	slots: {
		type: [String],
		required: true
	},
	userId:{ // these field can be link to users collections. 
		type: String,
		required: true
	}
 });

 module.exports = Mongoose.model('Booking', bookingSchema);
 