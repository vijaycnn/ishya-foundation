var momentz = require('moment-timezone');
const responder = require('../utils/responder');
const slideContextService = require('../services/slideContext.service');
const moment = require('moment');

let SlideContextController = {
    //use this for frontend list
    getList: async (request, response, next) => {
        try {
            let data = await slideContextService.getSlideContextList();
            const rows = data.rows.map((r) => r.get({ plain: true }));
            const groupedSlides = rows.reduce((acc, row) => {
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
    getSlideContextList: async (request, response, next) => {
        try {
            let data = await slideContextService.getSlideContextList(true);
            const rows = data.rows.map((r) => r.get({ plain: true }));
                            
            // console.log('lit >>>>>>>:::', mentors);
            let dataList =  { 'totalRecord': data.count, 'list': rows };
            return responder.sendFilterResponse(response, 200, "success", dataList, "List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    checkValidSlideContext: async (request, response, next) => {
        try {
            console.log('validate controller reached', request.body);
            let checkIfExist = false;
            let slideId = request.body.slideId ? request.body.slideId : 0;
            checkIfExist = await slideContextService.checkExistSlideContext(request.body.slideNumber, slideId);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', "Context Already Exist");
            } else {
                return responder.sendResponse(response, 200, "success", '', "No match found");
            }
        } catch (error) {
            return next(error);
        }
    },  
    createSlideContext: async (request, response, next) => {
        try {
            console.log('create controller reached', request.body, request.user);
            if(request.body.slideNumber.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            let checkIfExist = false;
            checkIfExist = await slideContextService.checkExistSlideContext(request.body.slideNumber);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', "Context Already Exist");
            } else {
                const SlideContextData = {
                    slideNumber: request.body.slideNumber.trim(),
                    title: request.body.title ? request.body.title.trim() : '',
                    subtitle: request.body.subtitle ? request.body.subtitle.trim() : '',
                    remark: request.body.remark ? request.body.remark.trim() : '',
                    createdBy: request.user.userId
                };
                let mentorCreate = await slideContextService.createSlideContext(SlideContextData);
                return responder.sendResponse(response, 200, "success", mentorCreate, "Context created successfully.");                
            }
        } catch (error) {
            return next(error);
        }
    },
    getSlideContextById:async(request, response, next) =>{
        try {
            let slideId = request.params.slideId;
            console.log('getById controller reached', request.params, request.user);

            const dataList = await slideContextService.getSlideContextById(slideId);
            if(dataList){
                // console.log('fileUrl :::', dataList.fileUrl);
                return responder.sendResponse(response, 200, "success", dataList, "Context retrieved successfully.");
            }else{
                return responder.sendResponse(response, 200, "error", {}, "No Context found");
            }
        } catch (error) {
            return next(error);
        }
    },
    updateSlideContext: async (request, response, next) => {
        try {
            // console.log('update controller reached', request.body, request.user);
            if(request.body.slideNumber.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            let checkIfExist = false;
            checkIfExist = await slideContextService.checkExistSlideContext(request.body.slideNumber, request.body.slideId);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', "Context Already Exist");
            } else {
                const SlideContextData = {
                    slideNumber: request.body.slideNumber.trim(),
                    title: request.body.title ? request.body.title.trim() : '',
                    subtitle: request.body.subtitle ? request.body.subtitle.trim() : '',
                    remark: request.body.remark ? request.body.remark.trim() : '',
                    updatedBy: request.user.userId,
                    updatedAt: new Date(),
                };
                let mentorUpdate = await slideContextService.updateSlideContext(SlideContextData, request.body.slideId);
                return responder.sendResponse(response, 200, "success", mentorUpdate, "Context updated successfully.");
                
            }
        } catch (error) {
            return next(error);
        }
    },
    changeSlideContextStatus: async (request, response, next) => {
        try {
            // console.log('changeFaqStatus reached', request.body, request.user);        
            const SlideContextData = {
                status: request.body.status,
                slideId: request.body.slideId,
            };
            let SlideContextUpdate = await slideContextService.changeSlideContextStatus(SlideContextData);
            return responder.sendResponse(response, 200, "success", SlideContextUpdate, "Context updated successfully.");            
        } catch (error) {
            return next(error);
        }
    },


};

module.exports = SlideContextController;
