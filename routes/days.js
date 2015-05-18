var express = require('express')

var dayRouter = express.Router()

var attractionRouter = express.Router()

var models = require('../models')

var Promise = require('bluebird')

// GET /days
dayRouter.get('/', function (req, res, next) {
    models.Day.find(function(err,days){
 		res.json ( {days: days} );
    })
});


// POST /days
dayRouter.post('/', function (req, res, next) {
	var howManyDays = req.body.dayNumber;
	var dayCreated = new models.Day({
		'number': howManyDays
	})
	dayCreated.save();
	res.json (dayCreated);
    // creates a new day and serves it as json
});
// GET /days/:id
dayRouter.get('/:id', function (req, res, next) {
	var id = req.params.id;
	console.log("We hit the id get request")
	models.Day.findOne({number: id}, function(err,days){
 		

 		res.json(days);
    })
    // serves a particular day as json
});
// DELETE /days/:id
dayRouter.delete('/:id', function (req, res, next) {
    // deletes a particular day
});

dayRouter.use('/:id', function(req, res, next) {
	req.id = req.params.id
	next();
})
dayRouter.use('/:id', attractionRouter);
// POST /days/:id/hotel

attractionRouter.post('/hotels', function (req, res, next) {
    // creates a reference to the hotel
    models.Day.findOne({number: req.id}, function(err,day){
    	
    	//console.log(req.body['hotel[0][_id]'])
    	day.hotel = req.body.hotelId;
    	day.save(function() {

		    res.send("this is the attractionRouter Hotel req");
    	});
    })
});
// DELETE /days/:id/hotel
attractionRouter.delete('/hotel', function (req, res, next) {
    // deletes the reference of the hotel

});
// POST /days/:id/restaurants
attractionRouter.post('/restaurants', function (req, res, next) {
    // creates a reference to a restaurant
    
    models.Day.findOne({number: req.id}, function(err,day){
    	
    	day.restaurants.push(req.body.restaurantId);
    	day.save(function() {

		    res.send("this is the attractionRouter Restaurant req");
    	});
    })
});
// DELETE /days/:dayId/restaurants/:restId
attractionRouter.delete('/restaurant/:id', function (req, res, next) {
    // deletes a reference to a restaurant
});
// POST /days/:id/thingsToDo
attractionRouter.post('/thingsToDo', function (req, res, next) {
    // creates a reference to a thing to do
    console.log(req)
    models.Day.findOne({number: req.id}, function(err,day){
    	
    	//console.log(req.body['hotel[0][_id]'])
    	day.thingsToDo.push(req.body.thingId);
    	day.save(function() {

		    res.send("this is the attractionRouter Thing req");
    	});
    })
});
// DELETE /days/:dayId/thingsToDo/:thingId
attractionRouter.delete('/thingsToDo/:id', function (req, res, next) {
    // deletes a reference to a thing to do
});

module.exports = dayRouter;