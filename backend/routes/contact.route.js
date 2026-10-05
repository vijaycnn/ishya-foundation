const express = require('express');
const router = express.Router();
const contactController = require('../src/controller/contact.controller');
const auth = require('../middleware/auth');  

//////////////////Frontend /////////////////////
router.get('/getPage',  function (request, response, next) {
    console.log('pageData route reached', request.body);
    contactController.getHomePage(request, response, next);
});

///////////////////////////// Backend /////////////////////
router.get('/getPageData',  [auth.login], function (request, response, next) {
    console.log('contactus route reached', request.body);
    contactController.getPageData(request, response, next);
});

router.post("/add", [auth.login], function (request, response, next) {
    contactController.addContactus(request, response, next)
});
router.post("/update", [auth.login], function (request, response, next) {
    contactController.updateContactus(request, response, next)
});


module.exports = router;
