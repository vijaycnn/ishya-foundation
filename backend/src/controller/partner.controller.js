const responder = require('../utils/responder');
const partnerService = require('../services/partner.service');
// const moment = require('moment');
const { S3Client,  GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({ region: "ap-south-1" });

let PartnerController = {

    getList: async (request, response, next) => {
        try {
            let data = await partnerService.getPartnerList(request);
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

            let dataList =  { 'totalRecord': data.count, 'list': bannerImages };
            return responder.sendFilterResponse(response, 200, "success", dataList, "Partner List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    getPartnerList: async (request, response, next) => {
        try {
            let data = await partnerService.getPartnerList(request, true);
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

            return responder.sendFilterResponse(response, 200, "success", dataList, "Partner List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    createPartner: async (request, response, next) => {
        try {
            // console.log('create controller reached', request.body, request.user);
            if(request.body.fileUrl.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            {
                
                const data = {
                    fileUrl: request.body.fileUrl.trim(),
                    createdBy: request.user.userId
                };
                let created = await partnerService.createPartner(data);
                return responder.sendResponse(response, 200, "success", created, "Partner created successfully.");
                
            }
        } catch (error) {
            return next(error);
        }
    },
    getPartnerById:async(request, response, next) =>{
        try {
            let partnerId = request.params.partnerId;
            // console.log('getById controller reached', request.params, request.user);

            const dataList = await partnerService.getPartnerById(partnerId);
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
                return responder.sendResponse(response, 200, "success", dataList, "Partner retrieved successfully.");
            }else{
                return responder.sendResponse(response, 200, "error", {}, "No Partner found");
            }
        } catch (error) {
            return next(error);
        }
    },
    updatePartner: async (request, response, next) => {
        try {
            // console.log('update controller reached', request.body, request.user);
            if( request.body.fileUrl.trim() == '' || request.body.partnerId == '' || !request.body.partnerId){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            {
                const data = {
                    fileUrl: request.body.fileUrl.trim(),
                    updatedBy: request.user.userId,
                    updatedAt: new Date(),
                };
                let updated = await partnerService.updatePartner(data, request.body.partnerId);
                return responder.sendResponse(response, 200, "success", updated, "Partner updated successfully.");
                
            }
        } catch (error) {
            return next(error);
        }
    },
    changePartnerStatus: async (request, response, next) => {
        try {
            // console.log('changeCategoryStatus reached', request.body, request.user);        
            const data = {
                status: request.body.status,
                partnerId: request.body.partnerId,
            };
            let updated = await partnerService.changePartnerStatus(data);
            return responder.sendResponse(response, 200, "success", updated, "Partner updated successfully.");            
        } catch (error) {
            return next(error);
        }
    },


};

module.exports = PartnerController;
