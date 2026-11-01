var momentz = require('moment-timezone');
const responder = require('../utils/responder');
const partnershipService = require('../services/partnership.service');
const moment = require('moment');

const { S3Client,  GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({ region: "ap-south-1" });

const { formattedType } = require("../utils/helper");

let PageController = {
    
    //use this for frontend list
    
    getHomePage: async (request, response, next) => {
        try {
            const data = await partnershipService.getPageData();
            const rows = data.rows?.map((row) => row.get({ plain: true }) ) || [];

            const filterRow = await Promise.all(
                rows.map(async (row) => {

                    const [
                        fileUrl1,
                        fileUrl2,
                    ] = await Promise.all([
                        row?.fileUrl1 ? DonateController.generateSignedUrl(row.fileUrl1): null,
                        row?.fileUrl2 ? DonateController.generateSignedUrl(row.fileUrl2): null,
                    ]);
                    if (fileUrl1) { row.fileViewUrl1 = fileUrl1; }
                    if (fileUrl2) { row.fileViewUrl2 = fileUrl2; }

                    return row;
                })
            );

            const dataList = {
                totalRecord: data.count,
                list: filterRow
            };

            return responder.sendFilterResponse(
                response,
                200,
                "success",
                dataList,
                "Page retrieved successfully."
            );

        } catch (error) {
            return next(error);
        }
    },    
    /////////////////////////////End Frontend ///////////////////

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
    getPageData: async (request, response, next) => {
        try {
            let data = await partnershipService.getPageData();
            const rows = data.rows?.map((r) => r.get({ plain: true }));
            
            const filterRow = await Promise.all(
                rows.map(async (row) => {
                    // console.log('url ',row)

                    if(row.PartnershipBlogs && row.PartnershipBlogs.length > 0){
                        //fetch here signed url for each row
                        row.PartnershipBlogs = await Promise.all(
                            row.PartnershipBlogs.map(async (item) => {

                                if (item.fileUrl) {
                                    item.fileViewUrl = await PageController.generateSignedUrl(item.fileUrl);
                                }
                                return item;
                            })
                        );                    
                    }
                    if(row.PartnershipContacts && row.PartnershipContacts.length > 0){
                        //fetch here signed url for each row
                        row.PartnershipContacts = await Promise.all(
                            row.PartnershipContacts.map(async (item) => {

                                if (item.fileUrl) {
                                    item.fileViewUrl = await PageController.generateSignedUrl(item.fileUrl);
                                }
                                return item;
                            })
                        );                    
                    }
                    return row;
                })
            );                
            console.log('lit >>>>>>>:::', filterRow);
            
            let dataList =  { 'totalRecord': data.count, 'list': filterRow };
            return responder.sendFilterResponse(response, 200, "success", dataList, `Page retrieved successfully.`);
        } catch (error) {
            return next(error);
        }
    },

    savePartnershipBlog: async (request, response, next) => {
        try {
            const result = await partnershipService.savePartnershipBlog(request.body,request);

            return response.status(200).json({
                status: "success",
                data: result,
                message:"Details saved successfully.",
            });

        } catch (error) {
            console.error("savePartnershipBlog controller error:",error);

            return next(error);
        }
    },
    savePartnershipContact: async (request, response, next) => {
        try {
            const result = await partnershipService.savePartnershipContact(request.body,request);

            return response.status(200).json({
                status: "success",
                data: result,
                message:"Contact Details saved successfully.",
            });

        } catch (error) {
            console.error("savePartnershipContact controller error:",error);

            return next(error);
        }
    },
    
    addDonate: async (request, response, next) => {
        try {
            // console.log('create controller reached', request.body, request.user);
            if(request.body.title.trim() == '' || request.body.remarks.trim() == '' || request.body.donateDesc.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }            
            {
                let title = request.body.title.trim();
                let shortDesc = request.body.shortDesc.trim() || "";
                let remarks = request.body.remarks.trim() || "";                
                let donateDesc = request.body.donateDesc.trim() || "";
                let btnText = request.body.btnText.trim() || "";
                let btnLink = request.body.btnLink.trim() || "";
                let overlayText = request.body.overlayText.trim() || "";
                
                let fileUrl1 = request.body?.fileUrl1?.trim() || "";
                let fileUrl2 = request.body?.fileUrl2?.trim() || "";

                const data = {
                    title,
                    shortDesc, remarks, fileUrl1, fileUrl2,
                    donateDesc, btnText, btnLink,  overlayText,
                    createdBy: request.user.userId
                };
                let created = await partnershipService.addDonate(data);
                if (created){

                    const [
                        image1,
                        image2,
                    ] = await Promise.all([
                        fileUrl1 ? DonateController.generateSignedUrl(fileUrl1): null,
                        fileUrl2 ? DonateController.generateSignedUrl(fileUrl2): null,
                    ]);

                    created = {
                        id : created?.id,
                        title,
                        title,
                        shortDesc, remarks, fileUrl1, fileUrl2,
                        donateDesc, btnText, btnLink, overlayText, 

                        fileViewUrl1: image1,
                        fileViewUrl2: image2,                                
                    }
                    // console.log('>>>>>', created);
                    return responder.sendResponse(response, 200, "success", created, "Donate details saved successfully.");
                }
                return responder.sendResponse(response, 200, "error", '', "Donate details save failed!");                
            }
        } catch (error) {
            return next(error);
        }
    },
    updateDonate: async (request, response, next) => {
        try {
            // console.log('create controller reached', request.body, request.user);
            if(!request.body.donateId || request.body.donateId == null || request.body.title.trim() == '' || request.body.remarks.trim() == '' || request.body.donateDesc.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            {
                let title = request.body.title.trim();
                let shortDesc = request.body.shortDesc.trim() || "";
                let remarks = request.body.remarks.trim() || "";                
                let donateDesc = request.body.donateDesc.trim() || "";
                let btnText = request.body.btnText.trim() || "";
                let btnLink = request.body.btnLink.trim() || "";
                let overlayText = request.body.overlayText.trim() || "";
                
                let fileUrl1 = request.body?.fileUrl1?.trim() || "";
                let fileUrl2 = request.body?.fileUrl2?.trim() || "";

                const data = {
                    title,
                    shortDesc, remarks, fileUrl1, fileUrl2,
                    donateDesc, btnText, btnLink, overlayText, 
                    updatedBy: request.user.userId
                };
                let updated = await partnershipService.editDonate(request.body.donateId, data);
                if (updated){

                    const [
                        image1,
                        image2,
                    ] = await Promise.all([
                        fileUrl1 ? DonateController.generateSignedUrl(fileUrl1): null,
                        fileUrl2 ? DonateController.generateSignedUrl(fileUrl2): null,
                    ]);
                    updated = {
                        id :request.body.donateId,
                        title,
                        shortDesc, remarks, fileUrl1, fileUrl2,
                        donateDesc, btnText, btnLink, overlayText,

                        fileViewUrl1: image1,
                        fileViewUrl2: image2,                       
                    }
                    // console.log('>>>>>', updated);
                    return responder.sendResponse(response, 200, "success", updated, "Donate details updated successfully.");
                }
                return responder.sendResponse(response, 200, "error", '', "Donate details updation failed!");
            }
        } catch (error) {
            return next(error);
        }
    },    


};

module.exports = PageController;
