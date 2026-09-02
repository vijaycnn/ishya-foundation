const responder = require('../utils/responder');
const locationService = require('../services/location.service');

let LocationController = {


  getStateList: async (request, response, next) => {
    try {

      let stateData = await locationService.getStateList();
      //   console.log("Data module",moduledata)
      return responder.sendResponse(response, 200, "success", stateData, "State retrieved successfully.");
    } catch (error) {
      return next(error);
    }
  },

  getByStateCity: async (request, response, next) => {
    try {
      const stateId = request.params.stateId;
      let cityGetByState = await locationService.getByStateCity(stateId);
      return responder.sendResponse(response, 200, "success", cityGetByState, "Cities By State retrieved successfully.");
    } catch (error) {
      return next(error);
    }
  },

};

module.exports = LocationController;
