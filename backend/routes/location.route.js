const express = require('express');
const router = express.Router();
const locationController = require('../src/controller/location.controller');

//STATE ROUTES
router.get('/stateList', function (request, response, next) {
    locationController.getStateList(request, response, next);
});

//CITY ROUTES
router.get("/city/getByState/:stateId", function (request, response, next) {
    locationController.getByStateCity(request, response, next)
})

router.get('/testHello', function (request, response, next) {
    console.log('Hi, route is reaching:::');
    response.send( { 'status': 'success', message: 'route is reaching'});
});

module.exports = router;
