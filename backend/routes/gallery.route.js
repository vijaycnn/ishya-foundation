const express = require('express');
const router = express.Router();
const galleryController = require('../src/controller/gallery.controller');
const auth = require('../middleware/auth');

///////////////////////////// GALLERY /////////////////////
//use this for frontend list
router.get('/getList', function (request, response, next) {
    galleryController.getList(request, response, next);
});
//use this for backend list
router.get('/list',  [auth.login], function (request, response, next) {
    // console.log('list route reached', request.body);
    galleryController.getGalleryList(request, response, next);
});
router.post("/create", [auth.login], function (request, response, next) {
    galleryController.createGallery(request, response, next)
});
router.get("/getById/:galleryId", [auth.login], function (request, response, next) {
    galleryController.getGalleryById(request, response, next)
});
router.post("/update", [auth.login], function (request, response, next) {
    galleryController.updateGallery(request, response, next)
});
router.post("/changeStatus", [auth.login], function (request, response, next) {
    galleryController.changeGalleryStatus(request, response, next)
});

module.exports = router;
