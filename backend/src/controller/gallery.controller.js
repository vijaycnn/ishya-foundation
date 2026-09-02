const responder = require('../utils/responder');
const galleryService = require('../services/gallery.service');
// const moment = require('moment');
const { S3Client,  GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({ region: "ap-south-1" });

let GalleryController = {

    getList: async (request, response, next) => {
        try {
            let data = await galleryService.getGalleryList(request);
            const rows = data.rows.map((r) => r.get({ plain: true }));
            const bannerImages = await Promise.all(
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
                        row.filePath = signedUrl.trim();
                    }else{
                        row.filePath = '';
                    }
                    return row;
                })
            ); 
            const groupedGalleries = bannerImages.reduce((acc, row) => {
                const key = row.type.trim();

                if (!acc[key]) {
                    acc[key] = [];
                }

                acc[key].push(row);
                return acc;
            }, {});

            let dataList =  { 'totalRecord': data.count, 'list': groupedGalleries };
            return responder.sendFilterResponse(response, 200, "success", dataList, "Gallery List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    getGalleryList: async (request, response, next) => {
        try {
            let data = await galleryService.getGalleryList(request, true);
            // console.log('rows', data.rows);
            const rows = data.rows.map((r) => r.get({ plain: true }));
            const galleries = await Promise.all(
                rows.map(async (row) => {
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

            let dataList =  { 'totalRecord': data.count, 'list': galleries };
            // console.log('lit', dataList);

            return responder.sendFilterResponse(response, 200, "success", dataList, "Gallery List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    createGallery: async (request, response, next) => {
        try {
            // console.log('create controller reached', request.body, request.user);
            if(request.body.type.trim() == '' || request.body.fileUrl.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            {
                const title = (request.body.title || "").trim();
                const data = {
                    type: request.body.type.trim(),
                    title,
                    fileUrl: request.body.fileUrl.trim(),
                    createdBy: request.user.userId
                };
                let galleryCreate = await galleryService.createGallery(data);
                return responder.sendResponse(response, 200, "success", galleryCreate, "Gallery created successfully.");
                
            }
        } catch (error) {
            return next(error);
        }
    },
    getGalleryById:async(request, response, next) =>{
        try {
            let galleryId = request.params.galleryId;
            // console.log('getById controller reached', request.params, request.user);

            const dataList = await galleryService.getGalleryById(galleryId);
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
                    dataList.fileUrl = signedUrl;
                }
                return responder.sendResponse(response, 200, "success", dataList, "Gallery retrieved successfully.");
            }else{
                return responder.sendResponse(response, 200, "error", {}, "No Gallery found");
            }
        } catch (error) {
            return next(error);
        }
    },
    updateGallery: async (request, response, next) => {
        try {
            // console.log('update controller reached', request.body, request.user);
            if(request.body.type.trim() == '' || request.body.fileUrl.trim() == '' || request.body.galleryId == '' || !request.body.galleryId){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            {
                const title = (request.body.title || "").trim();
                const data = {
                    type: request.body.type.trim(),
                    title,
                    fileUrl: request.body.fileUrl.trim(),
                    updatedBy: request.user.userId,
                    updatedAt: new Date(),
                };
                let galleryUpdate = await galleryService.updateGallery(data, request.body.galleryId);
                return responder.sendResponse(response, 200, "success", galleryUpdate, "Gallery updated successfully.");
                
            }
        } catch (error) {
            return next(error);
        }
    },
    changeGalleryStatus: async (request, response, next) => {
        try {
            // console.log('changeCategoryStatus reached', request.body, request.user);        
            const data = {
                status: request.body.status,
                galleryId: request.body.galleryId,
            };
            let galleryUpdate = await galleryService.changeGalleryStatus(data);
            return responder.sendResponse(response, 200, "success", galleryUpdate, "Gallery updated successfully.");            
        } catch (error) {
            return next(error);
        }
    },


};

module.exports = GalleryController;
