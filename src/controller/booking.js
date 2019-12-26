'use strict';
var { saveBooking, getAllBookings, updateBooking } = require('../database/booking');
const Booking = require('../../models/booking');

/**
 * Get Bookings from database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getBookings = async (req, res) => {
	try {
		  // We should we JOI or any other validation module to perfrom validation on query params.
		let queryData = req.query;
		let results = await getAllBookings(queryData);
		if (results && results.length) {
			return res.status(200).json(results);
		} else {
			return res.status(204).json();
		}
	} catch (error) {
		console.log('Error while getting bookings', error);
		return res.status(500).json({
			message: error.message
		});
	}
}

/**
 * Create booking and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.createBooking = async (req, res) => {
	try {
		  // We should we JOI or any other validation module to perfrom validation on body params.
		  	let { startTime, endTime, bookingDate, userId } = req.body;
			let timePart = startTime.split(":");
			let hours = Number(timePart[0]);
			let minutes = Number(timePart[1]);
			let slots = [`${twoDigitNumber(hours)}:${twoDigitNumber(minutes)}`];

			let endTimePart = endTime.split(":");
			let endHours = Number(endTimePart[0]);
			let endMinutes = Number(endTimePart[1]);
			let booking = await Booking.findOne({
				bookingDate: bookingDate,
				userId: userId
			})
			if(booking && booking.slots && booking.slots.length){
				slots = booking.slots;
			}
			if(booking && booking.slots && booking.slots.indexOf(startTime) === -1){
				slots.push(`${twoDigitNumber(hours)}:${twoDigitNumber(minutes)}`);
			}
			let timeSlot;
			do {
				if(minutes+15 < 60){
					minutes = minutes + 15;
				} else {
					hours = hours +1;
					minutes = 0;
				}
				timeSlot = `${twoDigitNumber(hours)}:${twoDigitNumber(minutes)}`;
				if(booking && booking.slots && booking.slots.indexOf(timeSlot) > -1){
					continue;
				} else {
					slots.push(timeSlot);
				}
			}
			while(hours < endHours || (hours === endHours && minutes < endMinutes))
			req.body.slots = slots;
			if(booking){
				await updateBooking(req.body, {
					bookingDate: bookingDate,
					userId: userId
				});
			} else {
				await saveBooking(req.body);
			}
		return res.status(201).json();
	} catch (error) {
		console.log('Error while saving booking', error);
		return res.status(500).json({
			message: error.message
		});
	}
}

function twoDigitNumber(n){
    return n > 9 ? "" + n: "0" + n;
}