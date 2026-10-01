const express = require('express');
const router = express.Router();
const programController = require('../src/controller/program.controller');
const auth = require('../middleware/auth');  

// const uservalidate = require('../middleware/validate.middelware');

router.get('/getList', function (request, response, next) {
    // console.log('list route reached', request.body);
    programController.getList(request, response, next);
});


router.get('/menuList',  function (request, response, next) {
    programController.getTypeList(request, response, next);
});



/////////////////  End Frontend

router.get('/typeList',  [auth.login], function (request, response, next) {
    programController.getTypeList(request, response, next);
});

router.get('/ddList',  [auth.login], function (request, response, next) {
    programController.getProgramddList(request, response, next);
});
router.get('/list',  [auth.login], function (request, response, next) {
    programController.getProgramList(request, response, next);
});
router.post("/create", [auth.login], function (request, response, next) {
    programController.createProgram(request, response, next)
});
router.get("/getById/:programId", [auth.login], function (request, response, next) {
    programController.getProgramById(request, response, next)
});
router.post("/update", [auth.login], function (request, response, next) {
    programController.updateProgram(request, response, next)
});
router.post("/changeStatus", [auth.login], function (request, response, next) {
    programController.changeProgramStatus(request, response, next)
});
router.post("/changeShowRecordStatus", [auth.login], function (request, response, next) {
    programController.changeShowRecordStatus(request, response, next)
});

//not in use
router.post("/valid", [auth.login], function (request, response, next) {
    programController.checkValidProgram(request, response, next)
});

module.exports = router;
