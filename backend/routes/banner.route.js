const express = require('express');
const router = express.Router();
const bannerGalleryController = require('../src/controller/bannerGallery.controller');
const auth = require('../middleware/auth');  

// const uservalidate = require('../middleware/validate.middelware');

///////////////////////////// BANNER-GALLERY /////////////////////
//use this for frontend list
router.get('/getList', function (request, response, next) {
    bannerGalleryController.getList(request, response, next);
});
//use this for backend list
router.get('/list',  [auth.login], function (request, response, next) {
    // console.log('list route reached', request.body);
    bannerGalleryController.getBannerGalleryList(request, response, next);
});
router.post("/create", [auth.login], function (request, response, next) {
    bannerGalleryController.createBannerGallery(request, response, next)
});
router.get("/getById/:categoryId", [auth.login], function (request, response, next) {
    bannerGalleryController.getBannerGalleryById(request, response, next)
});
router.post("/update", [auth.login], function (request, response, next) {
    bannerGalleryController.updateBannerGallery(request, response, next)
});
router.post("/changeStatus", [auth.login], function (request, response, next) {
    bannerGalleryController.changeBannerGalleryStatus(request, response, next)
});

module.exports = router;
