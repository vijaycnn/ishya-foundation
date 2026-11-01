const responder = require('../utils/responder');
const partnershipService = require('../services/partnership.service');
const partnerService =  require('../services/partner.service');
var momentz = require('moment-timezone');
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

            const partnerData = await partnerService.getHomePagePartnerList();
            
            const partnerDataWithSignedUrls = await Promise.all(
                (partnerData || []).map(async (program) => {
                    // Convert Sequelize instance to plain object
                    const programObj = program.get ? program.get({ plain: true }) : program;

                    // console.log("test row >>>", programObj);
                    const fileViewUrl = programObj.fileUrl ? await PageController.generateSignedUrl(programObj.fileUrl) : null;
                    return {...programObj, fileViewUrl, };
                })
            );

            const filterRow = await Promise.all(
                rows.map(async (row) => {
                    if(row.PartnershipBlogs && row.PartnershipBlogs.length > 0){
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
                        row.PartnershipContacts = await Promise.all(
                            row.PartnershipContacts.map(async (item) => {

                                if (item.fileUrl) {
                                    item.fileViewUrl = await PageController.generateSignedUrl(item.fileUrl);
                                }
                                return item;
                            })
                        );
                    }
                    row.partners = partnerDataWithSignedUrls;

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


};

module.exports = PageController;
