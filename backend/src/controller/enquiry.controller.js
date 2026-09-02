var momentz = require('moment-timezone');
const responder = require('../utils/responder');
const enquiryService = require('../services/enquiry.service');
const verificationCodeService = require('../services/otp.service');
const { uploadBufferToS3, uploadS3, listS3Objects } = require('../utils/s3');
const helper = require('../utils/helper');
const moment = require('moment');
const { S3Client, HeadObjectCommand } = require("@aws-sdk/client-s3");
const {deleteS3Object } = require('./upload.controller');


const s3 = new S3Client({
  region: process.env.AWS_REGION,  // Role credentials auto-used
});

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "pdf",
    "doc",
    "video/mp4",
    "audio/mpeg",
    "video/x-ms-wmv",
    "webm",
    "mkv",
    "flv",
    "vob",
    "mov",
    "avi",
    "wmv",
    "yuv",
    "amv",
    "mp4",
    "mpg",
    "svi",
    "3gp",
    "3g2",   
];

let EnquiryController = {

    getMediaList:async(request, response, next)=>{
        let basePath = process.env.S3_BASE_PATH || '';
        let s3_result = await listS3Objects(basePath);
        if(s3_result){
            return responder.sendResponse(response, 200, "success", s3_result, "MediaList fetched successfully.");
        }else{
            return responder.sendResponse(response, 200, "error", {}, "MediaList fetched failed.");
        }
    },
    getEnquiryListByFilter: async (request, response, next) => {
        try {
            console.log('enquiry controller reached', request.body, request.query);
            let documentData = await enquiryService.getEnquiryListByFilter(request);
            return responder.sendFilterResponse(response, 200, "success", documentData, "Enquiry List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    
    validateEnquiry: async (request, response, next) => {
        try {
            console.log('validate controller reached', request.body);
            let checkIfExist = false;
            checkIfExist = await enquiryService.checkExistEnquiry(request.body.contact, request.body.email);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', "Enquiry Already Exist for this contact number");
            } else {
                //Call here generate otp and sms api
                const otpData = await verificationCodeService.getOTP(request.body.contact, 2);
                console.log('otpData', otpData);

                if (otpData && otpData?.phone.trim() == request.body.contact.trim()) {
                    console.log('step::: 1');
                    return responder.sendResponse(response, 200, "successWithVerified", otpData, "ContactNumber already verified");
                }
                console.log('step::: 2');

                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // valid 5 min

                const verificationCodeData = {
                    phone: request.body.contact,
                    otpCode: otp,
                    expiresAt:  expiresAt,
                };
                // console.log('OTP Data', verificationCodeData);
                let delRes = await verificationCodeService.deleteOTP(request.body.contact);
                // console.log('delRes :: ', delRes);
                let otpCreate = await verificationCodeService.insertOTP(verificationCodeData);
                
                //send here sms api
                let templateDetails= await conn.Notifications.findOne({where: {stateSlug:'otp-verification'}, raw:true});
                if(templateDetails){
                    let smsTemplate = templateDetails.smsTemplate;
                    let smsTemplateId = templateDetails.smsTemplateId;
                    let replaceObj={
                        rm_otp:otp,
                    }
                    smsTemplate= await helper.stringReplace(smsTemplate,replaceObj)
                    //send mail to all assign mail
                    let apiRes = await helper.send_sms(request.body.contact, smsTemplate, smsTemplateId);
                    console.log('apiRes :: ', apiRes);
                    return responder.sendResponse(response, 200, "success", otpCreate, "OTP Send Successfully");
                }else{
                    return responder.sendResponse(response, 200, "error", {}, "OTP Send Failed");
                }
            }
        } catch (error) {
            return next(error);
        }
    },   

    verifyOTP: async (request, response, next) => {
        try {
            console.log('verifyOTP controller reached', request.body);
            const otpData = await verificationCodeService.getOTP(request.body.contact);
            if (otpData) {
                // console.log('verifyOTP otpData', otpData);
                if (otpData.length == 0){
                    return responder.sendResponse(response, 200, "error", '', "Invalid OTP");
                }
                if (new Date() > otpData.expiresAt){
                    return responder.sendResponse(response, 200, "error", '', "OTP Expired");
                }
                if (otpData.otpCode.trim() != request.body.verificationCode.trim()){
                    return responder.sendResponse(response, 200, "error", '', "Invalid OTP");
                }
                
                const codeId = otpData.id;
                if(codeId){
                    const verificationCodeData = {
                        verified: 2
                    };
                    console.log('OTP Data', verificationCodeData);
                    let otpVerify = await verificationCodeService.updateOTP(verificationCodeData, codeId);
                    return responder.sendResponse(response, 200, "success", otpVerify, "OTP Verified");
                }else{
                    return responder.sendResponse(response, 200, "error", '', "Invalid OTP");
                }
            }else{
                return responder.sendResponse(response, 200, "error", '', "Invalid OTP");
            }
        } catch (error) {
            return next(error);
        }
    },
    createEnquiry: async (request, response, next) => {
    try {
        console.log('create controller reached', request.body, request.file);
        let checkIfExist = false;
        checkIfExist = await enquiryService.checkExistEnquiry(request.body.contact, request.body.email);
        if (checkIfExist == true) {
            return responder.sendResponse(response, 200, "error", '', "Enquiry Already Exist for this contact number");
        } else {

            const command = new HeadObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: request?.body?.s3Key
            });

            const metadata = await s3.send(command);

            if (metadata.ContentLength > MAX_FILE_SIZE || !allowedMimeTypes.includes(metadata.ContentType)) {
                console.log('Invalid file upload');
                await deleteS3Object(request.body.s3Key);

                return responder.sendResponse(
                    response,
                    400,
                    "error",
                    "",
                    "Maximum file size is 500 MB."
                );
                
            }

            // const tmpFilename = request.file.filename;
            // let documentFilePath = '';
            // let extList=['jpeg','jpg','png', 'pdf'];
            // let Imgext= request.file.filename.split('.').pop();

            // if(extList.includes(Imgext.toLowerCase())){   
                // let documentFilePath = '';
                // if (request.file) {
                //     let s3_result = await uploadS3(request.file.buffer, request.file.originalname,
                // request.file.mimetype);
                //     documentFilePath = s3_result.fileName;
                //     console.log('documentFilePath', documentFilePath);
                // }

                let dob = '';
                if(request.body.dob){
                    dob = moment(request.body.dob).format('YYYY-MM-DD');
                }
                const enquiryData = {
                    name: request.body.name,
                    dob: dob,
                    contact: request.body.contact != '' ? request.body.contact.trim() : null,
                    email: request.body.email != '' ? request.body.email.trim() : null,
                    stateId: request.body.stateId != '' ? request.body.stateId : null,
                    cityId: request.body.cityId != '' ? request.body.cityId : null,                    
                    address: request.body.address != '' ? request.body.address.trim() : null,
                    pincode: request.body.pincode != '' ? request.body.pincode.trim() : null,
                    interest_in_role: request.body.interest_in_role != '' ? request.body.interest_in_role.trim() : null,
                    other_roles: request.body.other_roles != '' ? request.body.other_roles.trim() : null,
                    story: request.body.story != '' ? request.body.story.trim() : null,
                    dream_remarks: request.body.dream_remarks != '' ? request.body.dream_remarks.trim() : null,
                    how_to_know_about_this : request.body.how_to_know_about_this ? request.body.how_to_know_about_this : null,
                    i_confim : 1,
                    read_tnc : 1,
                    agree_tnc : 1,
                    media_url: request.body.videoUrl ? request.body.videoUrl : '',
                    status: 1
                };
                let enquiryCreate = await enquiryService.createEnquiry(enquiryData);
                return responder.sendResponse(response, 200, "success", enquiryCreate, "Enquiry created successfully.");
            // }else{
            //     responder.sendResponse(response, 200, "error", '', "Only Image OR PDF allowed.");
            // }
        }
    } catch (error) {
        return next(error);
    }
    },
};

module.exports = EnquiryController;
