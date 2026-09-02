const express = require('express');
const router = express.Router();
const slideController = require('../src/controller/slideContext.controller');
const auth = require('../middleware/auth');

///////////////////////////// SlideContext /////////////////////
router.get('/getList', function (request, response, next) {
    slideController.getList(request, response, next);
});
router.get('/list',  [auth.login], function (request, response, next) {
    // console.log('list route reached', request.body);
    slideController.getSlideContextList(request, response, next);
});
router.post("/valid", [auth.login], function (request, response, next) {
    slideController.checkValidSlideContext(request, response, next)
});
router.post("/create", [auth.login], function (request, response, next) {
    slideController.createSlideContext(request, response, next)
});
router.get("/getById/:slideId", [auth.login], function (request, response, next) {
    slideController.getSlideContextById(request, response, next)
});
router.post("/update", [auth.login], function (request, response, next) {
    slideController.updateSlideContext(request, response, next)
});
router.post("/changeStatus", [auth.login], function (request, response, next) {
    slideController.changeSlideContextStatus(request, response, next)
});


module.exports = router;
