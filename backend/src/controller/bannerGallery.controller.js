const responder = require('../utils/responder');
const bannerGalleryService = require('../services/bannerGallery.service');
// const moment = require('moment');
const { S3Client,  GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({ region: "ap-south-1" });

let BannerGalleryController = {

    getList: async (request, response, next) => {
        try {
            let data = await bannerGalleryService.getBannerGalleryList(request);
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
                        row.image = signedUrl.trim();
                    }else{
                        row.image = '';
                    }
                    return row;
                })
            ); 
            let dataList =  { 'totalRecord': data.count, 'list': bannerImages };
            return responder.sendFilterResponse(response, 200, "success", dataList, "Banner-Gallery List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    getBannerGalleryList: async (request, response, next) => {
        try {
            let data = await bannerGalleryService.getBannerGalleryList(request, true);
            // console.log('rows', data.rows);
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
                        let signedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

                        // console.log('>>>', signedUrl);
                        row.fileUrl = signedUrl;
                    }else{
                        row.fileUrl = '';
                    }
                    return row;
                })
            );   

            let dataList =  { 'totalRecord': data.count, 'list': bannerImages };
            // console.log('lit', dataList);

            return responder.sendFilterResponse(response, 200, "success", dataList, "Banner-Gallery List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    createBannerGallery: async (request, response, next) => {
        try {
            // console.log('create controller reached', request.body, request.user);
            if(request.body.type.trim() == '' || request.body.fileUrl.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            {
                const categoryData = {
                    type: request.body.type,
                    title: request.body.title.trim(),
                    description: request.body.description.trim(),
                    fileUrl: request.body.fileUrl,
                    createdBy: request.user.userId
                };
                let categoryCreate = await bannerGalleryService.createBannerGallery(categoryData);
                return responder.sendResponse(response, 200, "success", categoryCreate, "Banner-Gallery created successfully.");
                
            }
        } catch (error) {
            return next(error);
        }
    },
    getBannerGalleryById:async(request, response, next) =>{
        try {
            let categoryId = request.params.categoryId;
            // console.log('getById controller reached', request.params, request.user);

            const dataList = await bannerGalleryService.getBannerCategoryById(categoryId);
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
                return responder.sendResponse(response, 200, "success", dataList, "Banner-Gallery retrieved successfully.");
            }else{
                return responder.sendResponse(response, 200, "error", {}, "No Category found");
            }
        } catch (error) {
            return next(error);
        }
    },
    updateBannerGallery: async (request, response, next) => {
        try {
            // console.log('update controller reached', request.body, request.user);
            if(request.body.type.trim() == '' || request.body.fileUrl.trim() == '' || request.body.categoryId == '' || !request.body.categoryId){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            {
                const categoryData = {
                    type: request.body.type,
                    title: request.body.title.trim(),
                    description: request.body.description.trim(),
                    fileUrl: request.body.fileUrl,
                    updatedBy: request.user.userId,
                    updatedAt: new Date(),
                };
                let categoryUpdate = await bannerGalleryService.updateBannerGallery(categoryData, request.body.categoryId);
                return responder.sendResponse(response, 200, "success", categoryUpdate, "Banner-Gallery updated successfully.");
                
            }
        } catch (error) {
            return next(error);
        }
    },
    changeBannerGalleryStatus: async (request, response, next) => {
        try {
            // console.log('changeCategoryStatus reached', request.body, request.user);        
            const categoryData = {
                status: request.body.status,
                categoryId: request.body.categoryId,
            };
            let categoryUpdate = await bannerGalleryService.changeBannerGalleryStatus(categoryData);
            return responder.sendResponse(response, 200, "success", categoryUpdate, "Banner-Gallery updated successfully.");            
        } catch (error) {
            return next(error);
        }
    },


};

module.exports = BannerGalleryController;
