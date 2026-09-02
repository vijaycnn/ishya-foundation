const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')
const enquiryController = require('../src/controller/enquiry.controller');
const {generateUploadUrl, generateUrl, getDownloadUrl} = require('../src/controller/upload.controller');
const auth = require('../middleware/auth');  
const uploadValidation = require("../middleware/uploadValidation");
const rateLimit = require("express-rate-limit");
// const uservalidate = require('../middleware/validate.middelware');
// const schemas = require('../src/validation/document.validate');

const uploadLimiter = rateLimit({
   windowMs: 30 * 60 * 1000, // 30 minutes
    max: 3,
    message: {
        success: false,
        message: "Maximum 3 requests allowed in 30 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Maximum 5 requests allowed in 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const enquiryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Maximum 10 requests allowed in 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100* 1024 * 1024 } }); // 100MB limit

router.post("/upload-url", [uploadLimiter, uploadValidation], generateUploadUrl);    //for Participants
router.post("/generateUrl", generateUrl);         //for Galleries or home contents
router.post("/download-url", getDownloadUrl);

router.post("/validate", enquiryLimiter, function (request, response, next) {
    enquiryController.validateEnquiry(request, response, next)
});
router.post("/verifyOTP", otpLimiter, function (request, response, next) {
    enquiryController.verifyOTP(request, response, next)
});
router.post("/create", enquiryLimiter, function (request, response, next) {
    enquiryController.createEnquiry(request, response, next)
});

router.get('/file/:image', function (request, response, next) {
    const bucket = gspstorage.bucket(process.env.GCS_BUCKET_NAME);
    let filePath = "assets/siteDocuments/" + request.params.image;
    var stream = bucket.file(filePath).createReadStream();
  
    if (path.extname(request.params.image) == ".pdf") {
      response.writeHead(200, { 'Content-Type': 'application/pdf' });
    } else if (path.extname(request.params.image) == ".jpg" || path.extname(request.params.image) == ".jpeg") {
      response.writeHead(200, { 'Content-Type': 'image/jpg' });
    } else if (path.extname(request.params.image) == ".png") {
      response.writeHead(200, { 'Content-Type': 'image/png' });
    }
  
    stream.on('data', function (data) {
      // console.log("MY IMAGE RESPONSE ",data);
      response.write(data);
    });
  
    stream.on('error', function (err) {
      console.log('error reading stream', err);
    });
  
    stream.on('end', function () {
      response.end();
    });
});

router.get('/mediaList', function (request, response, next) {
    enquiryController.getMediaList(request, response, next);
});
// router.post("/create", upload.single('uploadMediaFile'), function (request, response, next) {
//     enquiryController.createEnquiry(request, response, next)
// });

router.get('/', [auth.login],function (request, response, next) {
    enquiryController.getEnquiryListByFilter(request, response, next);
});
// router.get('/filter', function (request, response, next) {
//     enquiryController.getDocumentListByFilter(request, response, next);
// });
// router.post("/getById", [auth.login, uservalidate(schemas.documentGetById, '')], function (request, response, next) {
//     enquiryController.getByIdDocument(request, response, next)
// });
// router.post("/update", [auth.login], upload.any(), function (request, response, next) {
//     enquiryController.updateDocument(request, response, next)
// });
// router.post("/delete", [auth.login, uservalidate(schemas.documentDelete, '')], function (request, response, next) {
//     enquiryController.changeDocumentStatus(request, response, next)
// });
module.exports = router;
