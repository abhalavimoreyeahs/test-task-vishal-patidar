'use strict';
var express = require('express');
var router = express.Router();
var userController = require('../controller/booking');

router.post('/', userController.createBooking);

router.get('/', userController.getBookings);


module.exports = (app) => {
	app.use('/bookings', router);
}