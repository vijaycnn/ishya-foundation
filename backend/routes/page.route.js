const express = require('express');
const router = express.Router();
const pageController = require('../src/controller/page.controller');
const auth = require('../middleware/auth');  

//////////////////Frontend /////////////////////
router.get('/detail/:type',  function (request, response, next) {
    console.log('pageData route reached', request.body);
    pageController.getHomePage(request, response, next);
});

router.get('/getList:type', function (request, response, next) {
    // console.log('list route reached', request.body);
    pageController.getFrontList(request, response, next);
});

///////////////////////////// pageData /////////////////////
router.get('/:type',  [auth.login], function (request, response, next) {
    console.log('pageData route reached', request.body);
    pageController.getPageData(request, response, next);
});
router.post("/valid", [auth.login], function (request, response, next) {
    pageController.checkValid(request, response, next)
});

/////////pageBanner ////////////
router.post("/addBanner", [auth.login], function (request, response, next) {
    pageController.addBanner(request, response, next)
});
router.post("/updateBanner", [auth.login], function (request, response, next) {
    pageController.updateBanner(request, response, next)
});

/////////////pageMap /////////////
router.post("/addPagemap", [auth.login], function (request, response, next) {
    pageController.addPagemap(request, response, next)
});
router.post("/updatePagemap", [auth.login], function (request, response, next) {
    pageController.updatePagemap(request, response, next)
});

/////////////pageAbout /////////////
router.post("/addPageabout", [auth.login], function (request, response, next) {
    pageController.addPageabout(request, response, next)
});
router.post("/updatePageabout", [auth.login], function (request, response, next) {
    pageController.updatePageabout(request, response, next)
});

/////////////pageVideo /////////////
router.post("/addPagevideo", [auth.login], function (request, response, next) {
    pageController.addPagevideo(request, response, next)
});
router.post("/updatePagevideo", [auth.login], function (request, response, next) {
    pageController.updatePagevideo(request, response, next)
});
/////////////pageProject /////////////
router.post("/updatePageproject", [auth.login], function (request, response, next) {
    pageController.updatePageproject(request, response, next)
});
/////////////pageTestimonial /////////////
router.post("/updatePagetestimonial", [auth.login], function (request, response, next) {
    pageController.updatePagetestimonial(request, response, next)
});


/////////////pageZigZag /////////////
router.post("/zigzag/save", [auth.login], function (request, response, next) {
    pageController.saveZigZag(request, response, next)
});
/////////////pageFeature /////////////
router.post("/feature/save", [auth.login], function (request, response, next) {
    pageController.saveFeature(request, response, next)
});

/////////////pageFounder /////////////
router.post("/addPagefounder", [auth.login], function (request, response, next) {
    pageController.addPagefounder(request, response, next)
});
router.post("/updatePagefounder", [auth.login], function (request, response, next) {
    pageController.updatePagefounder(request, response, next)
});

/////////////pageTeam /////////////
router.post("/team/save", [auth.login], function (request, response, next) {
    pageController.saveTeam(request, response, next)
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
