const express = require('express');
const router = express.Router();
const blogController = require('../src/controller/blog.controller');
const auth = require('../middleware/auth');  

///////////////////////////// BlogPage /////////////////////

router.get('/getPage', function (request, response, next) {
    // console.log('learning page route reached', request.body);
    blogController.getFrontList(request, response, next);
});
router.get("/:slug", function (request, response, next) {
    blogController.getBySlug(request, response, next)
});
/////////////////  End Frontend /////////////////////////


router.get('/list',  [auth.login], function (request, response, next) {
    // console.log('list route reached', request.body);
    blogController.getList(request, response, next);
});

router.post("/valid", [auth.login], function (request, response, next) {
    blogController.checkValid(request, response, next)
});
router.post("/create", [auth.login], function (request, response, next) {
    blogController.create(request, response, next)
});
router.get("/getById/:blogId", [auth.login], function (request, response, next) {
    blogController.getById(request, response, next)
});
router.post("/update", [auth.login], function (request, response, next) {
    blogController.update(request, response, next)
});
router.post("/changeStatus", [auth.login], function (request, response, next) {
    blogController.changeStatus(request, response, next)
});


module.exports = router;
