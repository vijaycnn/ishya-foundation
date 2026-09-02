var momentz = require('moment-timezone');
const responder = require('../utils/responder');
const mentorService = require('../services/mentor.service');
const moment = require('moment');

const { S3Client,  GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({ region: "ap-south-1" });

let MentorController = {
    //use this for frontend list
    getList: async (request, response, next) => {
        try {
            let data = await mentorService.getMentorList();
            const rows = data.rows.map((r) => r.get({ plain: true }));
            const mentors = await Promise.all(
                rows.map(async (row) => {
                    if(row.fileUrl != ''){
                        let filePath = row.fileUrl.trim();
                        let key = filePath.split(".amazonaws.com/")[1]

                        const command = new GetObjectCommand({
                        Bucket: process.env.S3_BUCKET,
                        Key: key,
                        });
                        let signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

                        // console.log('>>>', signedUrl);
                        row.image = signedUrl;
                    }else{
                        row.image = '';
                    }
                    return row;
                })
            );                
            // console.log('lit >>>>>>>:::', mentors);
            let dataList =  { 'totalRecord': data.count, 'list': mentors };
            return responder.sendFilterResponse(response, 200, "success", dataList, "Mentor List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    //use this for backend list
    getMentorList: async (request, response, next) => {
        try {
            let data = await mentorService.getMentorList(true);
            const rows = data.rows.map((r) => r.get({ plain: true }));
            const mentors = await Promise.all(
                rows.map(async (row) => {
                    if(row.fileUrl != ''){
                        let filePath = row.fileUrl.trim();
                        let key = filePath.split(".amazonaws.com/")[1]

                        const command = new GetObjectCommand({
                        Bucket: process.env.S3_BUCKET,
                        Key: key,
                        });
                        let signedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

                        // console.log('>>>', signedUrl);
                        row.fileUrl = signedUrl;
                    }else{
                        row.fileUrl = '';
                    }
                    return row;
                })
            );                
            // console.log('lit >>>>>>>:::', mentors);
            let dataList =  { 'totalRecord': data.count, 'list': mentors };
            return responder.sendFilterResponse(response, 200, "success", dataList, "Mentor List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    checkValidMentor: async (request, response, next) => {
        try {
            console.log('validate controller reached', request.body);
            let checkIfExist = false;
            let mentorId = request.body.mentorId ? request.body.mentorId : 0;
            checkIfExist = await mentorService.checkExistMentor(request.body.name, request.body.title, mentorId);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', "Mentor Already Exist for this name");
            } else {
                return responder.sendResponse(response, 200, "success", '', "No match found");
            }
        } catch (error) {
            return next(error);
        }
    },  
    createMentor: async (request, response, next) => {
        try {
            console.log('create controller reached', request.body, request.user);
            if(request.body.name.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            let checkIfExist = false;
            checkIfExist = await mentorService.checkExistMentor(request.body.name, request.body.title);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', "Mentor Already Exist");
            } else {
                const mentorData = {
                    name: request.body.name.trim(),
                    orderNumber: request.body.orderNumber,
                    title: request.body.title ? request.body.title.trim() : '',
                    fileUrl: request.body.fileUrl,
                    remark1: request.body.remark1 ? request.body.remark1.trim() : '',
                    remark2: request.body.remark2 ? request.body.remark2.trim() : '',
                    createdBy: request.user.userId
                };
                let mentorCreate = await mentorService.createMentor(mentorData);
                return responder.sendResponse(response, 200, "success", mentorCreate, "Mentor created successfully.");                
            }
        } catch (error) {
            return next(error);
        }
    },
    getMentorById:async(request, response, next) =>{
        try {
            let mentorId = request.params.mentorId;
            console.log('getById controller reached', request.params, request.user);

            const dataList = await mentorService.getMentorById(mentorId);
            if(dataList){
                // console.log('fileUrl :::', dataList.fileUrl);
                if(dataList.fileUrl != ''){
                    let filePath = dataList.fileUrl.trim();
                    let key = filePath.split(".amazonaws.com/")[1];
                    const command = new GetObjectCommand({
                        Bucket: process.env.S3_BUCKET,
                        Key: key,
                    });
                    let signedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
                    // console.log('>>>', signedUrl);
                    dataList.fileUrl = signedUrl;
                }
                return responder.sendResponse(response, 200, "success", dataList, "Mentor retrieved successfully.");
            }else{
                return responder.sendResponse(response, 200, "error", {}, "No Mentor found");
            }
        } catch (error) {
            return next(error);
        }
    },
    updateMentor: async (request, response, next) => {
        try {
            // console.log('update controller reached', request.body, request.user);
            if(request.body.name.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            let checkIfExist = false;
            checkIfExist = await mentorService.checkExistMentor(request.body.name, request.body.title, request.body.mentorId);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', "Mentor Already Exist");
            } else {
                const mentorData = {
                    name: request.body.name.trim(),
                    orderNumber: request.body.orderNumber,
                    title: request.body.title ? request.body.title.trim() : '',
                    fileUrl: request.body.fileUrl,
                    remark1: request.body.remark1 ? request.body.remark1.trim() : '',
                    remark2: request.body.remark2 ? request.body.remark2.trim() : '',
                    updatedBy: request.user.userId,
                    updatedAt: new Date(),
                };
                let mentorUpdate = await mentorService.updateMentor(mentorData, request.body.mentorId);
                return responder.sendResponse(response, 200, "success", mentorUpdate, "Mentor updated successfully.");
                
            }
        } catch (error) {
            return next(error);
        }
    },
    changeMentorStatus: async (request, response, next) => {
        try {
            // console.log('changeFaqStatus reached', request.body, request.user);        
            const mentorData = {
                status: request.body.status,
                mentorId: request.body.mentorId,
            };
            let mentorUpdate = await mentorService.changeMentorStatus(mentorData);
            return responder.sendResponse(response, 200, "success", mentorUpdate, "Mentor updated successfully.");            
        } catch (error) {
            return next(error);
        }
    },


};

module.exports = MentorController;
