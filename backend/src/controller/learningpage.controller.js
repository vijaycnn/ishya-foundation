var momentz = require('moment-timezone');
const responder = require('../utils/responder');
const learningpageService = require('../services/learningpage.service');
const moment = require('moment');

const { S3Client,  GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({ region: "ap-south-1" });

const { formattedType } = require("../utils/helper");

let LearningpageController = {
    
    //use this for frontend list
    getFrontList: async (request, response, next) => {
        try {
            let type = request.params.type;
            let data = await learningpageService.getList(type);
            const rows = data.rows.map((r) => r.get({ plain: true }));
            const mentors = await Promise.all(
                rows.map(async (row) => {
                    const [
                        fileUrl,
                    ] = await Promise.all([
                        row?.fileUrl ? LearningpageController.generateSignedUrl(row.fileUrl): null,
                    ]);
                    if (fileUrl) { row.image = fileUrl; }

                    delete row.fileUrl;
                    delete row.attachFileUrl;

                    return row;
                })
            );                
            // console.log('lit >>>>>>>:::', mentors);
            let dataList =  { 'totalRecord': data.count, 'list': mentors };
            return responder.sendFilterResponse(response, 200, "success", dataList, `${formattedType(type)} retrieved successfully.`);
        } catch (error) {
            return next(error);
        }
    },
    generateSignedUrl: async (fileUrl) => {
        if (!fileUrl) {
            return null;
        }

        try {

            let key = "";

            const filePath = fileUrl.trim();

            // If complete S3 URL is stored
            if (filePath.includes(".amazonaws.com/")) {

                const url = new URL(filePath);

                key = decodeURIComponent(
                    url.pathname.replace(/^\/+/, "")
                );

            } else {

                // If only S3 key/path is stored
                key = filePath.replace(/^\/+/, "");
            }

            if (!key) {
                return null;
            }

            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: key,
            });

            return await getSignedUrl(
                s3,
                command,
                {
                    expiresIn: 900
                }
            );

        } catch (error) {

            console.error(
                "Generate S3 signed URL error:",
                error
            );

            return null;
        }
    },
    downloadAttachment: async (request, response, next) => {
        try {
            const { id } = request.params;

            const newsletter = await learningpageService.getById(id);

            if (!newsletter) {
                return response.status(404).json({
                    status: "error",
                    message: "Newsletter not found."
                });
            }

            if (!newsletter.attachFileUrl) {
                return response.status(404).json({
                    status: "error",
                    message: "Newsletter attachment not found."
                });
            }

            let key = "";
            const filePath = newsletter.attachFileUrl.trim();

            /*
            * If DB contains:
            * https://bucket.s3.ap-south-1.amazonaws.com/uploads/newsletter/file.pdf
            *
            * convert it to:
            * uploads/newsletter/file.pdf
            */
            if (filePath.includes(".amazonaws.com/")) {
                const url = new URL(filePath);

                key = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
            } else {
                // If DB already contains S3 key
                key = filePath.replace(/^\/+/, "");
            }

            if (!key) {
                return response.status(404).json({
                    status: "error",
                    message: "Invalid S3 file path."
                });
            }

            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: key
            });

            const s3Response = await s3.send(command);

            // Filename
            const fileName = key.split("/").pop() || `newsletter-${id}.pdf`;

            response.setHeader("Content-Type", s3Response.ContentType || "application/pdf" );

            response.setHeader("Content-Disposition", `attachment; filename="${fileName}"` );

            if (s3Response.ContentLength) {
                response.setHeader(
                    "Content-Length",
                    s3Response.ContentLength
                );
            }

            // Stream S3 → Node → Browser
            s3Response.Body.pipe(response);

        } catch (error) {
            console.error("Newsletter download error:", error);

            if (!response.headersSent) {
                return response.status(500).json({
                    status: "error",
                    message: "Unable to download newsletter."
                });
            }

            next(error);
        }
    },
    //use this for backend list
    getList: async (request, response, next) => {
        try {
            let type = request.params.type;
            console.log('>>>>>', type, request.query);
            let data = await learningpageService.getList(type, true);
            const rows = data.rows.map((r) => r.get({ plain: true }));
            const mentors = await Promise.all(
                rows.map(async (row) => {

                    const [
                        fileUrl,
                    ] = await Promise.all([
                        row?.fileUrl ? LearningpageController.generateSignedUrl(row.fileUrl): null,
                    ]);
                    if (fileUrl) { row.fileUrl = fileUrl; }
                    return row;
                })
            );                
            // console.log('lit >>>>>>>:::', mentors);
            let dataList =  { 'totalRecord': data.count, 'list': mentors };
            return responder.sendFilterResponse(response, 200, "success", dataList, `${formattedType(type)} retrieved successfully.`);
        } catch (error) {
            return next(error);
        }
    },
    checkValid: async (request, response, next) => {
        try {
            console.log('validate controller reached', request.body);
            let checkIfExist = false;
            let mentorId = request.body.mentorId ? request.body.mentorId : 0;
            let type = request.body.type;
            checkIfExist = await learningpageService.checkExist(type, request.body.title, mentorId);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', `${formattedType(type)} Already Exist for this Title`);
            } else {
                return responder.sendResponse(response, 200, "success", '', "No match found");
            }
        } catch (error) {
            return next(error);
        }
    },  
    create: async (request, response, next) => {
        try {
            // console.log('create controller reached', request.body, request.user);
            let type = request.body.type;
            if(request.body.type.trim() == '' || request.body.title.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            let checkIfExist = false;
            checkIfExist = await learningpageService.checkExist(type, request.body.title);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', `${formattedType(type)} Already Exist`);
            } else {
                const mentorData = {
                    type: request.body.type.trim(),
                    orderNumber: request.body.orderNumber,
                    title: request.body.title ? request.body.title.trim() : '',
                    fileUrl: request.body.fileUrl,
                    attachFileUrl: request.body?.attachFileUrl ?? '',
                    remark1: request.body.remark1 ? request.body.remark1.trim() : '',
                    // remark2: request.body.remark2 ? request.body.remark2.trim() : '',
                    createdBy: request.user.userId
                };
                let mentorCreate = await learningpageService.create(mentorData);
                return responder.sendResponse(response, 200, "success", mentorCreate, `${formattedType(type)} created successfully.`);                
            }
        } catch (error) {
            return next(error);
        }
    },
    getById:async(request, response, next) =>{
        try {
            let mentorId = request.params.mentorId;
            let type = request.params.pageType;
            console.log('getById controller reached', request.params, request.user);

            const dataList = await learningpageService.getById(mentorId);
            if(dataList){
                // console.log('fileUrl :::', dataList.fileUrl);
                // if(dataList.fileUrl != ''){
                //     let filePath = dataList.fileUrl.trim();
                //     let key = filePath.split(".amazonaws.com/")[1];
                //     const command = new GetObjectCommand({
                //         Bucket: process.env.S3_BUCKET,
                //         Key: key,
                //     });
                //     let signedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
                //     // console.log('>>>', signedUrl);
                //     dataList.fileUrl = signedUrl;
                // }
                const [
                    fileUrl,
                    attachFileUrl,
                ] = await Promise.all([
                    dataList?.fileUrl ? LearningpageController.generateSignedUrl(dataList.fileUrl): null,
                    dataList?.attachFileUrl ? LearningpageController.generateSignedUrl(dataList.attachFileUrl): null,
                ]);
                if (fileUrl) { dataList.fileUrl = fileUrl; }
                if (attachFileUrl) { dataList.attachFileUrl = attachFileUrl; }

                return responder.sendResponse(response, 200, "success", dataList, `${formattedType(type)} retrieved successfully.`);
            }else{
                return responder.sendResponse(response, 200, "error", {}, "No Record found");
            }
        } catch (error) {
            return next(error);
        }
    },
    update: async (request, response, next) => {
        try {
            // console.log('update controller reached', request.body, request.user);
            let type = request.body.type;
            if(request.body.type.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            let checkIfExist = false;
            checkIfExist = await learningpageService.checkExist(type, request.body.title, request.body.mentorId);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', `${formattedType(type)} Already Exist`);
            } else {
                const mentorData = {
                    orderNumber: request.body.orderNumber,
                    title: request.body.title ? request.body.title.trim() : '',
                    fileUrl: request.body.fileUrl,
                    attachFileUrl: request.body?.attachFileUrl ?? '',
                    remark1: request.body.remark1 ? request.body.remark1.trim() : '',
                    // remark2: request.body.remark2 ? request.body.remark2.trim() : '',
                    updatedBy: request.user.userId,
                    updatedAt: new Date(),
                };
                let mentorUpdate = await learningpageService.update(mentorData, request.body.mentorId);
                return responder.sendResponse(response, 200, "success", mentorUpdate, `${formattedType(type)} updated successfully.`);
                
            }
        } catch (error) {
            return next(error);
        }
    },
    changeStatus: async (request, response, next) => {
        try {
            // console.log('changeFaqStatus reached', request.body, request.user);  
            let type = request.body.pageType;      
            const mentorData = {
                status: request.body.status,
                mentorId: request.body.mentorId,
            };
            let mentorUpdate = await learningpageService.changeStatus(mentorData);
            return responder.sendResponse(response, 200, "success", mentorUpdate, `${formattedType(type)} updated successfully.`);            
        } catch (error) {
            return next(error);
        }
    },


};

module.exports = LearningpageController;
