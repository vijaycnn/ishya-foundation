const express = require('express');
const router = express.Router();
const slideFileController = require('../src/controller/slideFile.controller');
const auth = require('../middleware/auth');

///////////////////////////// GALLERY /////////////////////
//use this for frontend list
router.get('/getList', function (request, response, next) {
    slideFileController.getList(request, response, next);
});
//use this for backend list
router.get('/list/:slideNumber',  [auth.login], function (request, response, next) {
    // console.log('list route reached', request.body);
    slideFileController.getSlideFileList(request, response, next);
});
router.post("/create", [auth.login], function (request, response, next) {
    slideFileController.createSlideFile(request, response, next)
});
router.get("/getById/:slideId", [auth.login], function (request, response, next) {
    slideFileController.getSlideFileById(request, response, next)
});
router.post("/update", [auth.login], function (request, response, next) {
    slideFileController.updateSlideFile(request, response, next)
});
router.post("/changeStatus", [auth.login], function (request, response, next) {
    slideFileController.changeSlideFileStatus(request, response, next)
});

module.exports = router;
