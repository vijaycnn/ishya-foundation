var momentz = require('moment-timezone');
const responder = require('../utils/responder');
const pageService = require('../services/page.service');
const moment = require('moment');

const { S3Client,  GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({ region: "ap-south-1" });

const { formattedType } = require("../utils/helper");

let PageController = {
    
    //use this for frontend list
    
    getHomePage: async (request, response, next) => {
        try {
            const type = request.params.type;

            console.log("Page type >>>", type);

            const data = await pageService.getPageData(type, true);

            const rows = data.rows?.map((row) => row.get({ plain: true }) ) || [];

            const filterRow = await Promise.all(
                rows.map(async (row) => {

                    const banner = row.PageBanners?.[0];
                    const video = row.PageVideos?.[0];
                    const map = row.PageMaps?.[0];
                    const about = row.PageAbouts?.[0];

                    const [
                        bannerUrl,
                        videoUrl,
                        mapUrl,
                        aboutUrl1,
                        aboutUrl2
                    ] = await Promise.all([

                        banner?.fileUrl
                            ? PageController.generateSignedUrl(
                                banner.fileUrl
                            )
                            : null,

                        video?.fileUrl
                            ? PageController.generateSignedUrl(
                                video.fileUrl
                            )
                            : null,

                        map?.fileUrl
                            ? PageController.generateSignedUrl(
                                map.fileUrl
                            )
                            : null,

                        about?.fileUrl1
                            ? PageController.generateSignedUrl(
                                about.fileUrl1
                            )
                            : null,

                        about?.fileUrl2
                            ? PageController.generateSignedUrl(
                                about.fileUrl2
                            )
                            : null
                    ]);

                    if (banner) {
                        banner.fileViewUrl = bannerUrl;
                    }

                    if (video) {
                        video.fileViewUrl = videoUrl;
                    }

                    if (map) {
                        map.fileViewUrl = mapUrl;
                    }

                    if (about) {
                        about.fileViewUrl1 = aboutUrl1;
                        about.fileViewUrl2 = aboutUrl2;
                    }

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
    getFrontList: async (request, response, next) => {
        try {
            let type = request.params.type;
            let data = await pageService.getList(type);
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
    //use this for backend list
    getPageData: async (request, response, next) => {
        try {
            let type = request.params.type;
            console.log('>>>>>', type, request.query);
            let data = await pageService.getPageData(type, true);
            const rows = data.rows?.map((r) => r.get({ plain: true }));
            
            const filterRow = await Promise.all(
                rows.map(async (row) => {
                    // console.log('url ',row)

                    if (row.PageBanners && row.PageBanners.length > 0 && row.PageBanners[0].fileUrl) {

                        row.PageBanners[0].fileViewUrl = await PageController.generateSignedUrl(row.PageBanners[0].fileUrl);
                    }
                    if (row.PageVideos && row.PageVideos.length > 0 && row.PageVideos[0].fileUrl) {

                        row.PageVideos[0].fileViewUrl = await PageController.generateSignedUrl(row.PageVideos[0].fileUrl);
                    }
                    if (row.PageMaps && row.PageMaps.length > 0 && row.PageMaps[0].fileUrl) {

                        row.PageMaps[0].fileViewUrl = await PageController.generateSignedUrl(row.PageMaps[0].fileUrl);
                        // console.log('>>>>>> map fileViewUrl', row.PageMaps[0].fileViewUrl);
                    }
                    if (row.PageAbouts && row.PageAbouts.length > 0) {

                        const about = row.PageAbouts[0];
                        if (about.fileUrl1) {
                            about.fileViewUrl1 = await PageController.generateSignedUrl(about.fileUrl1);
                        }
                        if (about.fileUrl2) {
                            about.fileViewUrl2 = await PageController.generateSignedUrl(about.fileUrl2);
                        }
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
    checkValid: async (request, response, next) => {
        try {
            console.log('validate controller reached', request.body);
            let checkIfExist = false;
            let mentorId = request.body.mentorId ? request.body.mentorId : 0;
            let type = request.body.type;
            checkIfExist = await pageService.checkExist(type, request.body.title, mentorId);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', `${formattedType(type)} Already Exist for this Title`);
            } else {
                return responder.sendResponse(response, 200, "success", '', "No match found");
            }
        } catch (error) {
            return next(error);
        }
    }, 
    
    ///////////////PageBanner ////////////////////
    addBanner: async (request, response, next) => {
        try {
            // console.log('create controller reached', request.body, request.user);
            if(!request.body.pageId || request.body.pageId == null || request.body.type.trim() == '' || request.body.fileUrl.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            {
                // const title = (request.body.title || "").trim();
                const data = {
                    pageId: request.body.pageId,
                    type: request.body.type.trim(),
                    fileUrl: request.body.fileUrl.trim(),
                    createdBy: request.user.userId
                };
                let bannerCreate = await pageService.addBanner(data);
                if (bannerCreate){
                    bannerCreate = {
                        id : bannerCreate?.id,
                        pageId: request.body.pageId,
                        type: request.body.type.trim(),
                        fileUrl: request.body.fileUrl,
                        fileViewUrl: await PageController.generateSignedUrl(request.body.fileUrl)                        
                    }
                    // console.log('>>>>>', bannerCreate);
                    return responder.sendResponse(response, 200, "success", bannerCreate, "Banner saved successfully.");
                }
                return responder.sendResponse(response, 200, "error", '', "Banner save failed!");                
            }
        } catch (error) {
            return next(error);
        }
    },
    updateBanner: async (request, response, next) => {
        try {
            // console.log('create controller reached', request.body, request.user);
            if(!request.body.bannerId || request.body.bannerId == null || request.body.type.trim() == '' || request.body.fileUrl.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            {
                // const title = (request.body.title || "").trim();
                const data = {
                    type: request.body.type.trim(),
                    fileUrl: request.body.fileUrl.trim(),
                    updatedBy: request.user.userId
                };
                let bannerUpdate = await pageService.editBanner(request.body.bannerId, data);
                if (bannerUpdate){
                    bannerUpdate = {
                        id :request.body.bannerId,
                        pageId: request.body.pageId,
                        type: request.body.type.trim(),
                        fileUrl: request.body.fileUrl,
                        fileViewUrl: await PageController.generateSignedUrl(request.body.fileUrl)                        
                    }
                    // console.log('>>>>>', bannerUpdate);
                    return responder.sendResponse(response, 200, "success", bannerUpdate, "Banner updated successfully.");
                }
                return responder.sendResponse(response, 200, "error", '', "Banner updation failed!");
            }
        } catch (error) {
            return next(error);
        }
    },    

    ///////////////PageMap ////////////////////
    addPagemap: async (request, response, next) => {
        try {
            // console.log('create controller reached', request.body, request.user);
            if(!request.body.pageId || request.body.pageId == null || request.body.title.trim() == '' || request.body.remarks.trim() == '' || request.body.fileUrl.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
        
            const title = (request.body.title || "").trim();
            const subTitle = (request.body.subTitle || "").trim();
            const remarks = (request.body.remarks || "").trim();
            const data = {
                pageId: request.body.pageId,
                title,
                subTitle,
                remarks,
                fileUrl: request.body.fileUrl.trim(),
                createdBy: request.user.userId
            };
            let mapAdded = await pageService.addPagemap(data);
            if (mapAdded){
                mapAdded = {
                    id : mapAdded?.id,
                    pageId: request.body.pageId,
                    title, subTitle, 
                    remarks,
                    fileUrl: request.body.fileUrl,
                    fileViewUrl: await PageController.generateSignedUrl(request.body.fileUrl)                        
                }
                // console.log('>>>>>', mapAdded);
                return responder.sendResponse(response, 200, "success", mapAdded, "Footprint content saved successfully.");
            }
            return responder.sendResponse(response, 200, "error", '', "Footprint content save failed!");                
            
        } catch (error) {
            return next(error);
        }
    },
    updatePagemap: async (request, response, next) => {
        try {
            // console.log('create controller reached', request.body, request.user);
            if(!request.body.mapId || request.body.mapId == null || request.body.title.trim() == '' || request.body.remarks.trim() == '' || request.body.fileUrl.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            
            const title = (request.body.title || "").trim();
            const subTitle = (request.body.subTitle || "").trim();
            const remarks = (request.body.remarks || "").trim();
            const data = {
                title,
                subTitle,
                remarks,
                fileUrl: request.body.fileUrl.trim(),
                updatedBy: request.user.userId
            };
            let mapUpdate = await pageService.editPagemap(request.body.mapId, data);
            if (mapUpdate){
                mapUpdate = {
                    id :request.body.mapId,
                    pageId: request.body.pageId,
                    title,
                    subTitle,
                    remarks,
                    fileUrl: request.body.fileUrl.trim(),
                    fileViewUrl: await PageController.generateSignedUrl(request.body.fileUrl)                        
                }
                // console.log('>>>>>', mapUpdate);
                return responder.sendResponse(response, 200, "success", mapUpdate, "Footprint content updated successfully.");
            }
            return responder.sendResponse(response, 200, "error", '', "Footprint content updation failed!");
        
        } catch (error) {
            return next(error);
        }
    }, 

    ///////////////PageAbout ////////////////////
    addPageabout: async (request, response, next) => {
        try {
            // console.log('create controller reached', request.body, request.user);
            if(!request.body.pageId || request.body.pageId == null ){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }

            if( (!request.body.title || request.body.title.trim() == '') && ( !request.body.title2 || request.body.title2.trim() == '') && (!request.body.title3 || request.body.title3.trim() == '') || request.body.remarks.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }

            if( (!request.body.fileUrlTxt1 || request.body.fileUrlTxt1.trim() == '') &&  request.body.fileUrl1.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            if( (!request.body.fileUrlTxt2 || request.body.fileUrlTxt2.trim() == '') &&  request.body.fileUrl2.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            if(request.body.tagTitle1){
                if( !request.body.tagDescription1 || request.body.tagDescription1.trim() == '' ){
                    return responder.sendResponse(response, 200, "error", '', "Missing Required!");
                }  
            }
            if(request.body.tagTitle2){
                if( !request.body.tagDescription2 || request.body.tagDescription2.trim() == '' ){
                    return responder.sendResponse(response, 200, "error", '', "Missing Required!");
                }  
            }
            //saved here
            {
                const title = (request.body.title || "").trim();
                const title2 = (request.body.title2 || "").trim();
                const title3 = (request.body.title3 || "").trim();
                const remarks = (request.body.remarks || "").trim();
                const fileUrlTxt1 = (request.body.fileUrlTxt1 || "").trim();
                const fileUrlTxt2 = (request.body.fileUrlTxt2 || "").trim();

                const fileUrl1 = (request.body.fileUrl1 || "").trim();
                const fileUrl2 = (request.body.fileUrl2 || "").trim();

                const tagTitle1 = (request.body.tagTitle1 || "").trim();
                const tagDescription1 = (request.body.tagDescription1 || "").trim();
                const tagTitle2 = (request.body.tagTitle2 || "").trim();
                const tagDescription2 = (request.body.tagDescription2 || "").trim();

                const data = {
                    pageId: request.body.pageId,
                    title, title2, title3, remarks,
                    fileUrlTxt1,
                    fileUrlTxt2,
                    fileUrl1: fileUrl1,
                    fileUrl2: fileUrl2,
                    tagTitle1,
                    tagDescription1,
                    tagTitle2,
                    tagDescription2,
                    createdBy: request.user.userId
                };
                let added = await pageService.addPageabout(data);
                if (added){
                    added = {
                        id : added?.id,
                        pageId: request.body.pageId,
                        title, title2, title3, remarks,
                        fileUrlTxt1,
                        fileUrlTxt2,
                        fileUrl1: fileUrl1,
                        fileUrl2: fileUrl2,
                        tagTitle1,
                        tagDescription1,
                        tagTitle2,
                        tagDescription2,
                        fileUrl1: fileUrl1,
                        fileViewUrl1: (fileUrl1 != '') ? await PageController.generateSignedUrl (fileUrl1) : '',
                        fileUrl2: fileUrl2,
                        fileViewUrl2: (fileUrl2 != '') ? await PageController.generateSignedUrl (fileUrl2) : '',
                    }
                    // console.log('>>>>>', added);
                    return responder.sendResponse(response, 200, "success", added, "About content saved successfully.");
                }
                return responder.sendResponse(response, 200, "error", '', "About content save failed!");                
            }
        } catch (error) {
            return next(error);
        }
    },
    updatePageabout: async (request, response, next) => {
        try {
            // console.log('create controller reached', request.body, request.user);
            if(!request.body.pageId || request.body.pageId == null || !request.body.aboutId || request.body.aboutId == null){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }

            if( (!request.body.title || request.body.title.trim() == '') && ( !request.body.title2 || request.body.title2.trim() == '') && (!request.body.title3 || request.body.title3.trim() == '') || request.body.remarks.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }

            if( (!request.body.fileUrlTxt1 || request.body.fileUrlTxt1.trim() == '') &&  request.body.fileUrl1.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            if( (!request.body.fileUrlTxt2 || request.body.fileUrlTxt2.trim() == '') &&  request.body.fileUrl2.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            if(request.body.tagTitle1){
                if( !request.body.tagDescription1 || request.body.tagDescription1.trim() == '' ){
                    return responder.sendResponse(response, 200, "error", '', "Missing Required!");
                }  
            }
            if(request.body.tagTitle2){
                if( !request.body.tagDescription2 || request.body.tagDescription2.trim() == '' ){
                    return responder.sendResponse(response, 200, "error", '', "Missing Required!");
                }  
            }
            {
                const title = (request.body.title || "").trim();
                const title2 = (request.body.title2 || "").trim();
                const title3 = (request.body.title3 || "").trim();
                const remarks = (request.body.remarks || "").trim();
                const fileUrlTxt1 = (request.body.fileUrlTxt1 || "").trim();
                const fileUrlTxt2 = (request.body.fileUrlTxt2 || "").trim();

                const fileUrl1 = (request.body.fileUrl1 || "").trim();
                const fileUrl2 = (request.body.fileUrl2 || "").trim();

                const tagTitle1 = (request.body.tagTitle1 || "").trim();
                const tagDescription1 = (request.body.tagDescription1 || "").trim();
                const tagTitle2 = (request.body.tagTitle2 || "").trim();
                const tagDescription2 = (request.body.tagDescription2 || "").trim();

                const data = {
                    title, title2, title3, remarks,
                    fileUrlTxt1,
                    fileUrlTxt2,
                    fileUrl1: fileUrl1,
                    fileUrl2: fileUrl2,
                    tagTitle1,
                    tagDescription1,
                    tagTitle2,
                    tagDescription2,
                    updatedBy: request.user.userId
                };

                let updated = await pageService.editPageabout(request.body.aboutId, data);
                if (updated){
                    updated = {
                        id :request.body.aboutId,
                        pageId: request.body.pageId,
                        title, title2, title3, remarks,
                        fileUrlTxt1,
                        fileUrlTxt2,
                        fileUrl1: fileUrl1,
                        fileUrl2: fileUrl2,
                        tagTitle1,
                        tagDescription1,
                        tagTitle2,
                        tagDescription2,
                        fileUrl1: fileUrl1,
                        fileViewUrl1: (fileUrl1 != '') ? await PageController.generateSignedUrl (fileUrl1) : '',
                        fileUrl2: fileUrl2,
                        fileViewUrl2: (fileUrl2 != '') ? await PageController.generateSignedUrl (fileUrl2) : '',                       
                    }
                    // console.log('>>>>>', updated);
                    return responder.sendResponse(response, 200, "success", updated, "About content updated successfully.");
                }
                return responder.sendResponse(response, 200, "error", '', "About content updation failed!");
            }
        } catch (error) {
            return next(error);
        }
    },

    ///////////////PageVideo ////////////////////    
    addPagevideo: async (request, response, next) => {
        try {
            // console.log('create controller reached', request.body, request.user);
            if(!request.body.pageId || request.body.pageId == null || request.body.type.trim() == '' || request.body.fileUrl.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            {
                const data = {
                    pageId: request.body.pageId,
                    type: request.body.type.trim(),
                    fileUrl: request.body.fileUrl.trim(),
                    createdBy: request.user.userId
                };
                let added = await pageService.addPagevideo(data);
                if (added){
                    added = {
                        id : added?.id,
                        pageId: request.body.pageId,
                        type: request.body.type.trim(),
                        fileUrl: request.body.fileUrl.trim(),
                        fileViewUrl: await PageController.generateSignedUrl(request.body.fileUrl)                        
                    }
                    // console.log('>>>>>', added);
                    return responder.sendResponse(response, 200, "success", added, "Media File saved successfully.");
                }
                return responder.sendResponse(response, 200, "error", '', "Media File save failed!");                
            }
        } catch (error) {
            return next(error);
        }
    },
    updatePagevideo: async (request, response, next) => {
        try {
            // console.log('create controller reached', request.body, request.user);
            if(!request.body.videoId || request.body.videoId == null || request.body.type.trim() == '' || request.body.fileUrl.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            {
                const data = {
                    type: request.body.type.trim(),
                    fileUrl: request.body.fileUrl.trim(),
                    updatedBy: request.user.userId
                };
                let updated = await pageService.editPagevideo(request.body.videoId, data);
                if (updated){
                    updated = {
                        id :request.body.videoId,
                        pageId: request.body.pageId,
                        type: request.body.type.trim(),
                        fileUrl: request.body.fileUrl.trim(),
                        fileViewUrl: await PageController.generateSignedUrl(request.body.fileUrl)                        
                    }
                    // console.log('>>>>>', updated);
                    return responder.sendResponse(response, 200, "success", updated, "Media File updated successfully.");
                }
                return responder.sendResponse(response, 200, "error", '', "Media File updation failed!");
            }
        } catch (error) {
            return next(error);
        }
    }, 


    create: async (request, response, next) => {
        try {
            console.log('create controller reached', request.body, request.user);
            let type = request.body.type;
            if(request.body.type.trim() == '' || request.body.title.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            let checkIfExist = false;
            checkIfExist = await pageService.checkExist(type, request.body.title);
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
                let mentorCreate = await pageService.create(mentorData);
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

            const dataList = await pageService.getById(mentorId);
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
            checkIfExist = await pageService.checkExist(type, request.body.title, request.body.mentorId);
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
                let mentorUpdate = await pageService.update(mentorData, request.body.mentorId);
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
            let mentorUpdate = await pageService.changeStatus(mentorData);
            return responder.sendResponse(response, 200, "success", mentorUpdate, `${formattedType(type)} updated successfully.`);            
        } catch (error) {
            return next(error);
        }
    },


};

module.exports = PageController;
