const express = require('express');
const router = express.Router();
const donateController = require('../src/controller/donate.controller');
const auth = require('../middleware/auth');  

//////////////////Frontend /////////////////////
router.get('/getPage',  function (request, response, next) {
    console.log('pageData route reached', request.body);
    donateController.getHomePage(request, response, next);
});

///////////////////////////// Backend /////////////////////
router.get('/getPageData',  [auth.login], function (request, response, next) {
    console.log('doante route reached', request.body);
    donateController.getPageData(request, response, next);
});

router.post("/add", [auth.login], function (request, response, next) {
    donateController.addDonate(request, response, next)
});
router.post("/update", [auth.login], function (request, response, next) {
    donateController.updateDonate(request, response, next)
});


module.exports = router;
