var momentz = require('moment-timezone');
const responder = require('../utils/responder');
const slideFileService = require('../services/slideFile.service');
const moment = require('moment');
const { S3Client,  GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({ region: "ap-south-1" });

let SlideFileController = {
    //use this for frontend list
    getList: async (request, response, next) => {
        try {
            let slideNumber = false;    // request.params.slideNumber;
            let data = await slideFileService.getSlideFileList(slideNumber);
            const rows = data.rows.map((r) => r.get({ plain: true }));
            const slideFiles = await Promise.all(
                rows.map(async (row) => {
                    row.slideNumber = row.slideNumber.trim();
                    if(row.fileUrl != ''){
                        let filePath = row.fileUrl.trim();
                        let key = filePath.split(".amazonaws.com/")[1]

                        const command = new GetObjectCommand({
                        Bucket: process.env.S3_BUCKET,
                        Key: key,
                        });
                        let signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

                        // console.log('>>>', signedUrl);
                        row.filePath = signedUrl.trim();
                    }else{
                        row.filePath = '';
                    }
                    return row;
                })
            ); 
            const groupedSlides = slideFiles.reduce((acc, row) => {
                const key = row.slideNumber;
                if (!acc[key]) {
                    acc[key] = [];
                }

                acc[key].push(row);
                return acc;
            }, {});
                           
            console.log('lit >>>>>>>:::', groupedSlides);
            let dataList =  { 'totalRecord': data.count, 'list': groupedSlides };
            return responder.sendFilterResponse(response, 200, "success", dataList, "List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    //use this for backend list
    getSlideFileList: async (request, response, next) => {
        try {
            let slideNumber = request.params.slideNumber;
            let data = await slideFileService.getSlideFileList(slideNumber, true);
            const rows = data.rows.map((r) => r.get({ plain: true }));

            const slides = await Promise.all(
                rows.map(async (row) => {
                    row.slideNumber = row.slideNumber.trim();
                    if(row.fileUrl != '' ){     //&& row.type.trim() == 'image'
                        let filePath = row.fileUrl.trim();
                        let key = filePath.split(".amazonaws.com/")[1];

                        const command = new GetObjectCommand({
                        Bucket: process.env.S3_BUCKET,
                        Key: key,
                        });
                        let signedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
                        row.filePath = signedUrl;
                    }else{
                        row.filePath = '';
                    }
                    return row;
                })
            ); 
                            
            // console.log('lit >>>>>>>:::', mentors);
            let dataList =  { 'totalRecord': data.count, 'list': slides };
            return responder.sendFilterResponse(response, 200, "success", dataList, "List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    checkValidSlideFile: async (request, response, next) => {
        try {
            console.log('validate controller reached', request.body);
            let checkIfExist = false;
            let slideId = request.body.slideId ? request.body.slideId : 0;
            checkIfExist = await slideFileService.checkExistSlideFile(request.body.slideNumber, slideId);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', "Context Already Exist");
            } else {
                return responder.sendResponse(response, 200, "success", '', "No match found");
            }
        } catch (error) {
            return next(error);
        }
    },  
    createSlideFile: async (request, response, next) => {
        try {
            console.log('create controller reached', request.body, request.user);
            if(request.body.slideNumber.trim() == '' || request.body.fileUrl.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            let checkIfExist = false;
            checkIfExist = await slideFileService.checkExistSlideFile(request.body.slideNumber);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', "Context Already Exist");
            } else {
                const SlideFileData = {
                    slideNumber: request.body.slideNumber.trim(),
                    fileUrl: request.body.fileUrl.trim(),
                    createdBy: request.user.userId
                };
                let mentorCreate = await slideFileService.createSlideFile(SlideFileData);
                return responder.sendResponse(response, 200, "success", mentorCreate, "Context created successfully.");                
            }
        } catch (error) {
            return next(error);
        }
    },
    getSlideFileById:async(request, response, next) =>{
        try {
            let slideId = request.params.slideId;
            console.log('getById controller reached', request.params, request.user);

            const dataList = await slideFileService.getSlideFileById(slideId);
            if(dataList){
                if(dataList.fileUrl != ''){
                    let filePath = dataList.fileUrl.trim();
                    let key = filePath.split(".amazonaws.com/")[1];
                    const command = new GetObjectCommand({
                        Bucket: process.env.S3_BUCKET,
                        Key: key,
                    });
                    let signedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
                    // console.log('>>>', signedUrl);
                    dataList.filePath = signedUrl;
                }
                // console.log('fileUrl :::', dataList.fileUrl);
                return responder.sendResponse(response, 200, "success", dataList, "Context retrieved successfully.");
            }else{
                return responder.sendResponse(response, 200, "error", {}, "No Context found");
            }
        } catch (error) {
            return next(error);
        }
    },
    updateSlideFile: async (request, response, next) => {
        try {
            // console.log('update controller reached', request.body, request.user);
            if(request.body.slideNumber.trim() == '' || request.body.fileUrl.trim() == '' || request.body.slideId == '' || !request.body.slideId){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            let checkIfExist = false;
            checkIfExist = await slideFileService.checkExistSlideFile(request.body.slideNumber, request.body.slideId);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', "Context Already Exist");
            } else {
                const SlideFileData = {
                    fileUrl: request.body.fileUrl.trim(),
                    updatedBy: request.user.userId,
                    updatedAt: new Date(),
                };
                let slideUpdate = await slideFileService.updateSlideFile(SlideFileData, request.body.slideId);
                return responder.sendResponse(response, 200, "success", slideUpdate, "Context updated successfully.");
                
            }
        } catch (error) {
            return next(error);
        }
    },
    changeSlideFileStatus: async (request, response, next) => {
        try {
            // console.log('changeFaqStatus reached', request.body, request.user);        
            const SlideFileData = {
                status: request.body.status,
                slideId: request.body.slideId,
            };
            let SlideFileUpdate = await slideFileService.changeSlideFileStatus(SlideFileData);
            return responder.sendResponse(response, 200, "success", SlideFileUpdate, "Context updated successfully.");            
        } catch (error) {
            return next(error);
        }
    },


};

module.exports = SlideFileController;
