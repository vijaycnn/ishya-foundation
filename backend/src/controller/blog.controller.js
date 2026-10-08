var momentz = require('moment-timezone');
const responder = require('../utils/responder');
const blogService = require('../services/blog.service');
const moment = require('moment');

const { S3Client,  GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({ region: "ap-south-1" });

const { formattedType } = require("../utils/helper");

let BlogController = {
    
    //use this for frontend list
    getFrontList: async (request, response, next) => {
        try {
            let data = await blogService.getList();
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
            return responder.sendFilterResponse(response, 200, "success", dataList, `Blogs retrieved successfully.`);
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
    //use this for backend list
    getList: async (request, response, next) => {
        try {
            let data = await blogService.getList(true);
            const rows = data.rows.map((r) => r.get({ plain: true }));
            const mentors = await Promise.all(
                rows.map(async (row) => {
                    const [
                        fileUrl,
                    ] = await Promise.all([
                        row?.fileUrl ? BlogController.generateSignedUrl(row.fileUrl): null,
                    ]);
                    if (fileUrl) { row.fileUrl = fileUrl; }
                    return row;
                })
            );                
            // console.log('lit >>>>>>>:::', mentors);
            let dataList =  { 'totalRecord': data.count, 'list': mentors };
            return responder.sendFilterResponse(response, 200, "success", dataList, `Blogs retrieved successfully.`);
        } catch (error) {
            return next(error);
        }
    },
    checkValid: async (request, response, next) => {
        try {
            console.log('validate controller reached', request.body);
            let checkIfExist = false;
            let blogId = request.body.blogId ? request.body.blogId : 0;
            let slug = request.body.slug;
            checkIfExist = await blogService.checkExist(slug, request.body.title, blogId);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', `Blog Already Exist for this Title`);
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
            if(request.body.slug?.trim() == '' || request.body.title?.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            let slug = request.body.slug;
            let checkIfExist = false;
            checkIfExist = await blogService.checkExist(slug, request.body.title);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', `Blog Already Exist`);
            } else {
                const data = {
                    title: request.body.title ? request.body.title.trim() : '',
                    slug: request.body.slug.trim(),
                    fileUrl: request.body.fileUrl,
                    remarks: request.body.remarks ? request.body.remarks.trim() : '',
                    publishAt: request.body?.publishAt ?? '',
                    publishBy: request.body?.publishBy ?? '',
                    createdBy: request.user.userId
                };
                let created = await blogService.create(data);
                return responder.sendResponse(response, 200, "success", created, `Blog created successfully.`);                
            }
        } catch (error) {
            return next(error);
        }
    },
    getById:async(request, response, next) =>{
        try {
            let blogId = request.params.blogId;
            console.log('getById controller reached', request.params, request.user);

            const dataList = await blogService.getById(blogId);
            if(dataList){
                const [
                    fileUrl,
                ] = await Promise.all([
                    dataList?.fileUrl ? BlogController.generateSignedUrl(dataList.fileUrl): null,
                ]);
                if (fileUrl) { dataList.fileUrl = fileUrl; }

                return responder.sendResponse(response, 200, "success", dataList, `Blog retrieved successfully.`);
            }else{
                return responder.sendResponse(response, 200, "error", {}, "No Record found");
            }
        } catch (error) {
            return next(error);
        }
    },
    getBySlug:async(request, response, next) =>{
        try {
            let slug = request.params.slug;
            // console.log('getById controller reached', request.params, request.user);

            const dataList = await blogService.getBySlug(slug);
            if(dataList){
                const [
                    fileUrl,
                ] = await Promise.all([
                    dataList?.fileUrl ? BlogController.generateSignedUrl(dataList.fileUrl): null,
                ]);
                if (fileUrl) { dataList.image = fileUrl; }

                return responder.sendResponse(response, 200, "success", dataList, `Blog retrieved successfully.`);
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
            if(!request.body.blogId || request.body.slug?.trim() == '' || request.body.title?.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            
            let checkIfExist = false;
            checkIfExist = await blogService.checkExist(request.body.slug?.trim(), request.body.title, request.body.blogId);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', `Blog Already Exist`);
            } else {
                const data = {
                    title: request.body.title ? request.body.title.trim() : '',
                    slug: request.body.slug.trim(),
                    fileUrl: request.body.fileUrl,
                    remarks: request.body.remarks ? request.body.remarks.trim() : '',
                    publishAt: request.body?.publishAt ?? '',
                    publishBy: request.body?.publishBy ?? '',
                    updatedBy: request.user.userId,
                    updatedAt: new Date(),
                };
                let updated = await blogService.update(data, request.body.blogId);
                return responder.sendResponse(response, 200, "success", updated, `Blog updated successfully.`);
                
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
                blogId: request.body.blogId,
            };
            let mentorUpdate = await blogService.changeStatus(mentorData);
            return responder.sendResponse(response, 200, "success", mentorUpdate, `Blog updated successfully.`);            
        } catch (error) {
            return next(error);
        }
    },


};

module.exports = BlogController;
