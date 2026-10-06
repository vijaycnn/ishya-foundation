const express = require('express');
const router = express.Router();
const partnerController = require('../src/controller/partner.controller');
const auth = require('../middleware/auth');

///////////////////////////// PARTNERS LOGO /////////////////////
//use this for frontend list
router.get('/getList', function (request, response, next) {
    partnerController.getList(request, response, next);
});
//use this for backend list
router.get('/list',  [auth.login], function (request, response, next) {
    // console.log('list route reached', request.body);
    partnerController.getPartnerList(request, response, next);
});
router.post("/create", [auth.login], function (request, response, next) {
    partnerController.createPartner(request, response, next)
});
router.get("/getById/:partnerId", [auth.login], function (request, response, next) {
    partnerController.getPartnerById(request, response, next)
});
router.post("/update", [auth.login], function (request, response, next) {
    partnerController.updatePartner(request, response, next)
});
router.post("/changeStatus", [auth.login], function (request, response, next) {
    partnerController.changePartnerStatus(request, response, next)
});

module.exports = router;
