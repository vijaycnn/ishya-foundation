var momentz = require('moment-timezone');
const responder = require('../utils/responder');
const contactService = require('../services/contactus.service');
const faqService = require('../services/faq.service');
const moment = require('moment');

const { S3Client,  GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({ region: "ap-south-1" });

const { formattedType } = require("../utils/helper");

let ContactController = {
    
    //use this for frontend list
    
    getHomePage: async (request, response, next) => {
        try {
            const data = await contactService.getPageData();
            const rows = data.rows?.map((row) => row.get({ plain: true }) ) || [];
            
            let faqData = await faqService.getFaqList(request, false);
            const faqRows = faqData.rows?.map((row) => row.get({ plain: true }) ) || [];

            const filterRow = await Promise.all(
                rows.map(async (row) => {

                    const [
                        mapUrl,
                        watsappUrl,
                        formUrl,
                        faqUrl
                    ] = await Promise.all([
                        row?.mapFileUrl ? ContactController.generateSignedUrl(row.mapFileUrl): null,
                        row?.watsappFileUrl ? ContactController.generateSignedUrl(row.watsappFileUrl): null,
                        row?.formFileUrl ? ContactController.generateSignedUrl(row.formFileUrl): null,
                        row?.faqFileUrl ? ContactController.generateSignedUrl(row.faqFileUrl): null,
                    ]);
                    if (mapUrl) { row.mapFileViewUrl = mapUrl; }
                    if (watsappUrl) { row.watsappFileViewUrl = watsappUrl; }
                    if (formUrl) { row.formFileViewUrl = formUrl; }
                    if (faqUrl) { row.faqFileViewUrl = faqUrl; }

                    return row;
                })
            );
            filterRow[0].faqs = faqRows ?? [];

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
            let data = await contactService.getPageData();
            const rows = data.rows?.map((r) => r.get({ plain: true }));
            
            const filterRow = await Promise.all(
                rows.map(async (row) => {
                    // console.log('url ',row)

                    const [
                        mapUrl,
                        watsappUrl,
                        formUrl,
                        faqUrl
                    ] = await Promise.all([
                        row?.mapFileUrl ? ContactController.generateSignedUrl(row.mapFileUrl): null,
                        row?.watsappFileUrl ? ContactController.generateSignedUrl(row.watsappFileUrl): null,
                        row?.formFileUrl ? ContactController.generateSignedUrl(row.formFileUrl): null,
                        row?.faqFileUrl ? ContactController.generateSignedUrl(row.faqFileUrl): null,
                    ]);
                    if (mapUrl) { row.mapFileViewUrl = mapUrl; }
                    if (watsappUrl) { row.watsappFileViewUrl = watsappUrl; }
                    if (formUrl) { row.formFileViewUrl = formUrl; }
                    if (faqUrl) { row.faqFileViewUrl = faqUrl; }

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
    
    addContactus: async (request, response, next) => {
        try {
            // console.log('create controller reached', request.body, request.user);
            if(request.body.title.trim() == '' || request.body.contactNumber.trim() == '' || request.body.email.trim() == '' || request.body.addressTitle1.trim() == '' || request.body.address1.trim() == '' || request.body.mapFileUrl.trim() == '' || request.body.watsappFileUrl.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            {
                let title = request.body.title.trim();
                let contactNumber = request.body.contactNumber.trim();
                let email = request.body.email.trim();
                let mapFileUrl = request.body.mapFileUrl.trim();
                let watsappFileUrl = request.body.watsappFileUrl.trim();

                let addressTitle1 = request.body.addressTitle1.trim();
                let address1 = request.body.address1.trim();
                let location1 = request.body.location1.trim();
                let addressTitle2 = request.body.addressTitle2?.trim() || "";
                let address2 = request.body.address2?.trim() || "";
                let location2 = request.body.location2?.trim() || "";
                let addressTitle3 = request.body.addressTitle3?.trim() || "";
                let address3 = request.body.address3?.trim() || "";
                let location3 = request.body.location3?.trim() || "";
                let heading = request.body.heading?.trim() || "";

                let formTitle = request.body.formTitle?.trim() || "";
                let formHeading = request.body.formHeading?.trim() || "";
                let faqTitle = request.body.faqTitle?.trim() || "";
                let faqHeading = request.body.faqHeading?.trim() || "";

                let formFileUrl = request.body?.formFileUrl?.trim() || "";
                let faqFileUrl = request.body?.faqFileUrl?.trim() || "";

                const data = {
                    title,
                    contactNumber, email, mapFileUrl, watsappFileUrl,
                    addressTitle1, address1, location1, 
                    addressTitle2, address2, location2,
                    addressTitle3, address3, location3,
                    heading,
                    formTitle, formHeading, formFileUrl, 
                    faqTitle, faqHeading, faqFileUrl, 
                    createdBy: request.user.userId
                };
                let created = await contactService.addContactus(data);
                if (created){

                    const [
                        mapUrl,
                        watsappUrl,
                        formUrl,
                        faqUrl
                    ] = await Promise.all([
                        mapFileUrl ? ContactController.generateSignedUrl(mapFileUrl): null,
                        watsappFileUrl ? ContactController.generateSignedUrl(watsappFileUrl): null,
                        formFileUrl ? ContactController.generateSignedUrl(formFileUrl): null,
                        faqFileUrl ? ContactController.generateSignedUrl(faqFileUrl): null,
                    ]);

                    created = {
                        id : created?.id,
                        title,
                        contactNumber, email, mapFileUrl, watsappFileUrl,
                        addressTitle1, address1, location1, 
                        addressTitle2, address2, location2,
                        addressTitle3, address3, location3,
                        heading,
                        formTitle, formHeading, formFileUrl, 
                        faqTitle, faqHeading, faqFileUrl,

                        mapFileViewUrl: mapUrl,
                        watsappFileViewUrl: watsappUrl,
                        formFileViewUrl: formUrl,
                        faqFileViewUrl: faqUrl,                                
                    }
                    // console.log('>>>>>', created);
                    return responder.sendResponse(response, 200, "success", created, "ContactUs saved successfully.");
                }
                return responder.sendResponse(response, 200, "error", '', "ContactUs save failed!");                
            }
        } catch (error) {
            return next(error);
        }
    },
    updateContactus: async (request, response, next) => {
        try {
            // console.log('create controller reached', request.body, request.user);
            if(!request.body.contactId || request.body.contactId == null || request.body.title.trim() == '' || request.body.contactNumber.trim() == '' || request.body.email.trim() == '' || request.body.addressTitle1.trim() == '' || request.body.address1.trim() == '' || request.body.mapFileUrl.trim() == '' || request.body.watsappFileUrl.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            {
                let title = request.body.title.trim();
                let contactNumber = request.body.contactNumber.trim();
                let email = request.body.email.trim();
                let mapFileUrl = request.body.mapFileUrl.trim();
                let watsappFileUrl = request.body.watsappFileUrl.trim();

                let addressTitle1 = request.body.addressTitle1.trim();
                let address1 = request.body.address1.trim();
                let location1 = request.body.location1.trim();
                let addressTitle2 = request.body.addressTitle2?.trim() || "";
                let address2 = request.body.address2?.trim() || "";
                let location2 = request.body.location2?.trim() || "";
                let addressTitle3 = request.body.addressTitle3?.trim() || "";
                let address3 = request.body.address3?.trim() || "";
                let location3 = request.body.location3?.trim() || "";
                let heading = request.body.heading?.trim() || "";

                let formTitle = request.body.formTitle?.trim() || "";
                let formHeading = request.body.formHeading?.trim() || "";
                let faqTitle = request.body.faqTitle?.trim() || "";
                let faqHeading = request.body.faqHeading?.trim() || "";

                let formFileUrl = request.body?.formFileUrl?.trim() || "";
                let faqFileUrl = request.body?.faqFileUrl?.trim() || "";

                const data = {
                    title,
                    contactNumber, email, mapFileUrl, watsappFileUrl,
                    addressTitle1, address1, location1, 
                    addressTitle2, address2, location2,
                    addressTitle3, address3, location3,
                    heading,
                    formTitle, formHeading, formFileUrl, 
                    faqTitle, faqHeading, faqFileUrl, 
                    updatedBy: request.user.userId
                };
                let updated = await contactService.editContactus(request.body.contactId, data);
                if (updated){

                    const [
                        mapUrl,
                        watsappUrl,
                        formUrl,
                        faqUrl
                    ] = await Promise.all([
                        mapFileUrl ? ContactController.generateSignedUrl(mapFileUrl): null,
                        watsappFileUrl ? ContactController.generateSignedUrl(watsappFileUrl): null,
                        formFileUrl ? ContactController.generateSignedUrl(formFileUrl): null,
                        faqFileUrl ? ContactController.generateSignedUrl(faqFileUrl): null,
                    ]);
                    updated = {
                        id :request.body.contactId,
                        title,
                        contactNumber, email, mapFileUrl, watsappFileUrl,
                        addressTitle1, address1, location1, 
                        addressTitle2, address2, location2,
                        addressTitle3, address3, location3,
                        heading,
                        formTitle, formHeading, formFileUrl, 
                        faqTitle, faqHeading, faqFileUrl,

                        mapFileViewUrl: mapUrl,
                        watsappFileViewUrl: watsappUrl,
                        formFileViewUrl: formUrl,
                        faqFileViewUrl: faqUrl,                       
                    }
                    // console.log('>>>>>', updated);
                    return responder.sendResponse(response, 200, "success", updated, "ContactUs updated successfully.");
                }
                return responder.sendResponse(response, 200, "error", '', "ContactUs updation failed!");
            }
        } catch (error) {
            return next(error);
        }
    },    


};

module.exports = ContactController;
