const express = require('express');
const router = express.Router();
const pageController = require('../src/controller/page.controller');
const auth = require('../middleware/auth');  

///////////////////////////// LearningPage /////////////////////
router.get('/:type',  [auth.login], function (request, response, next) {
    console.log('pageData route reached', request.body);
    pageController.getPageData(request, response, next);
});
router.get('/getList:type', function (request, response, next) {
    // console.log('list route reached', request.body);
    pageController.getFrontList(request, response, next);
});
router.post("/valid", [auth.login], function (request, response, next) {
    pageController.checkValid(request, response, next)
});
router.post("/create", [auth.login], function (request, response, next) {
    pageController.create(request, response, next)
});
router.get("/getById/:pageType/:mentorId", [auth.login], function (request, response, next) {
    pageController.getById(request, response, next)
});
router.post("/update", [auth.login], function (request, response, next) {
    pageController.update(request, response, next)
});
router.post("/changeStatus", [auth.login], function (request, response, next) {
    pageController.changeStatus(request, response, next)
});


module.exports = router;
