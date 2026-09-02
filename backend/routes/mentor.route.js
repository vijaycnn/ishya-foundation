const express = require('express');
const router = express.Router();
const mentorController = require('../src/controller/mentor.controller');
const auth = require('../middleware/auth');  

// const uservalidate = require('../middleware/validate.middelware');

///////////////////////////// Mentors /////////////////////
router.get('/getList', function (request, response, next) {
    // console.log('list route reached', request.body);
    mentorController.getList(request, response, next);
});
router.get('/list',  [auth.login], function (request, response, next) {
    // console.log('list route reached', request.body);
    mentorController.getMentorList(request, response, next);
});
router.post("/valid", [auth.login], function (request, response, next) {
    mentorController.checkValidMentor(request, response, next)
});
router.post("/create", [auth.login], function (request, response, next) {
    mentorController.createMentor(request, response, next)
});
router.get("/getById/:mentorId", [auth.login], function (request, response, next) {
    mentorController.getMentorById(request, response, next)
});
router.post("/update", [auth.login], function (request, response, next) {
    mentorController.updateMentor(request, response, next)
});
router.post("/changeStatus", [auth.login], function (request, response, next) {
    mentorController.changeMentorStatus(request, response, next)
});


module.exports = router;
