const express = require('express');
const router = express.Router();
const partnershipController = require('../src/controller/partnership.controller');
const auth = require('../middleware/auth');  

//////////////////Frontend /////////////////////
router.get('/getPage',  function (request, response, next) {
    console.log('pageData route reached', request.body);
    partnershipController.getHomePage(request, response, next);
});

///////////////////////////// Backend /////////////////////
router.get('/getPageData',  [auth.login], function (request, response, next) {
    console.log('route reached', request.body);
    partnershipController.getPageData(request, response, next);
});

router.post("/saveBlog", [auth.login], function (request, response, next) {
    partnershipController.savePartnershipBlog(request, response, next)
});
router.post("/saveContact", [auth.login], function (request, response, next) {
    partnershipController.savePartnershipContact(request, response, next)
});


module.exports = router;
