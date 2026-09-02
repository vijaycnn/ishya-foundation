var momentz = require('moment-timezone');
const responder = require('../utils/responder');
const faqCategoryService = require('../services/faqCategory.service');
const faqService = require('../services/faq.service');
const moment = require('moment');

let FaqController = {
    //use this for frontend list
    getList: async (request, response, next) => {
        try {
            let faqData = await faqService.getFaqList(request, false);
            let categoryData = await faqCategoryService.getFaqCategoryList(false);
            
            // console.log('rows', data.rows);
            let dataList =  { 'faqData': faqData.rows, 'categoryData': categoryData.rows };
            // console.log('lit', dataList);

            return responder.sendResponse(response, 200, "success", dataList, "Faq List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    getFaqList: async (request, response, next) => {
        try {
            let data = await faqService.getFaqList(request, true);
            // console.log('rows', data.rows);
            let dataList =  { 'totalRecord': data.count, 'list': data.rows };
            // console.log('lit', dataList);

            return responder.sendFilterResponse(response, 200, "success", dataList, "Faq List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    
    createFaq: async (request, response, next) => {
        try {
            console.log('create controller reached', request.body, request.user);
            if(request.body.quest.trim() == '' || request.body.answer.trim() == '' || request.body.orderNumber == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            let checkIfExist = false;
            checkIfExist = await faqService.checkExistFaq(request.body.categoryId, request.body.quest);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', "Faq Already Exist");
            } else {
                const faqData = {
                    categoryId: request.body.categoryId,
                    quest: request.body.quest.trim(),
                    answer: request.body.answer.trim(),
                    orderNumber: request.body.orderNumber,
                    createdBy: request.user.userId
                };
                let faqCreate = await faqService.createFaq(faqData);
                return responder.sendResponse(response, 200, "success", faqCreate, "Faq created successfully.");                
            }
        } catch (error) {
            return next(error);
        }
    },
    getFaqById:async(request, response, next) =>{
        try {
            let faqId = request.params.faqId;
            console.log('getById controller reached', request.params, request.user);

            const dataList = await faqService.getFaqById(faqId);
            if(dataList){
                return responder.sendResponse(response, 200, "success", dataList, "Faq retrieved successfully.");
            }else{
                return responder.sendResponse(response, 200, "error", {}, "No Faq found");
            }
        } catch (error) {
            return next(error);
        }
    },
    updateFaq: async (request, response, next) => {
        try {
            console.log('update controller reached', request.body, request.user);
            if(request.body.quest.trim() == '' || request.body.answer.trim() == '' || request.body.orderNumber == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            let checkIfExist = false;
            checkIfExist = await faqService.checkExistFaq(request.body.categoryId, request.body.quest, request.body.faqId);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', "Faq Already Exist");
            } else {
                const faqData = {
                    categoryId: request.body.categoryId,
                    quest: request.body.quest.trim(),
                    answer: request.body.answer.trim(),
                    orderNumber: request.body.orderNumber,
                    updatedBy: request.user.userId,
                    updatedAt: new Date(),
                };
                let faqUpdate = await faqService.updateFaq(faqData, request.body.faqId);
                return responder.sendResponse(response, 200, "success", faqUpdate, "Faq updated successfully.");
                
            }
        } catch (error) {
            return next(error);
        }
    },
    changeFaqStatus: async (request, response, next) => {
        try {
            // console.log('changeFaqStatus reached', request.body, request.user);        
            const faqData = {
                status: request.body.status,
                faqId: request.body.faqId,
            };
            let faqUpdate = await faqService.changeFaqStatus(faqData);
            return responder.sendResponse(response, 200, "success", faqUpdate, "Faq updated successfully.");            
        } catch (error) {
            return next(error);
        }
    },


};

module.exports = FaqController;
