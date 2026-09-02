const express = require('express');
const router = express.Router();
const faqCategoryController = require('../src/controller/faqCategory.controller');
const faqController = require('../src/controller/faq.controller');
const auth = require('../middleware/auth');  

// const uservalidate = require('../middleware/validate.middelware');

///////////////////////////// FAQs /////////////////////
//use this for frontend list
router.get('/getList', function (request, response, next) {
    faqController.getList(request, response, next);
});
//use this for backend list
router.get('/list',  [auth.login], function (request, response, next) {
    // console.log('list route reached', request.body);
    faqController.getFaqList(request, response, next);
});
router.post("/create", [auth.login], function (request, response, next) {
    faqController.createFaq(request, response, next)
});
router.get("/getById/:faqId", [auth.login], function (request, response, next) {
    faqController.getFaqById(request, response, next)
});
router.post("/update", [auth.login], function (request, response, next) {
    faqController.updateFaq(request, response, next)
});
router.post("/changeStatus", [auth.login], function (request, response, next) {
    faqController.changeFaqStatus(request, response, next)
});

/////////////////////////////FAQ CATEGORY  /////////////////////
router.get('/categoryList',  [auth.login], function (request, response, next) {
    // console.log('Categorylist route reached', request.body);
    faqCategoryController.getCategoryList(request, response, next);
});
router.get('/categoryDDList', [auth.login], function (request, response, next) {
    faqCategoryController.getCategoryDDList(request, response, next);
});
router.post("/createCategory", [auth.login], function (request, response, next) {
    faqCategoryController.createCategory(request, response, next)
});
router.get("/getCategoryById/:categoryId", [auth.login], function (request, response, next) {
    faqCategoryController.getCategoryById(request, response, next)
});
router.post("/updateCategory", [auth.login], function (request, response, next) {
    faqCategoryController.updateCategory(request, response, next)
});
router.post("/changeCategoryStatus", [auth.login], function (request, response, next) {
    faqCategoryController.changeCategoryStatus(request, response, next)
});

module.exports = router;
