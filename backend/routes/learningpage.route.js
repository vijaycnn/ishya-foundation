const express = require('express');
const router = express.Router();
const learningpageController = require('../src/controller/learningpage.controller');
const auth = require('../middleware/auth');  

// const uservalidate = require('../middleware/validate.middelware');

///////////////////////////// LearningPage /////////////////////
router.get('/getList:type', function (request, response, next) {
    // console.log('list route reached', request.body);
    learningpageController.getFrontList(request, response, next);
});
router.get('/list/:type',  [auth.login], function (request, response, next) {
    // console.log('list route reached', request.body);
    learningpageController.getList(request, response, next);
});
router.post("/valid", [auth.login], function (request, response, next) {
    learningpageController.checkValid(request, response, next)
});
router.post("/create", [auth.login], function (request, response, next) {
    learningpageController.create(request, response, next)
});
router.get("/getById/:pageType/:mentorId", [auth.login], function (request, response, next) {
    learningpageController.getById(request, response, next)
});
router.post("/update", [auth.login], function (request, response, next) {
    learningpageController.update(request, response, next)
});
router.post("/changeStatus", [auth.login], function (request, response, next) {
    learningpageController.changeStatus(request, response, next)
});


module.exports = router;
