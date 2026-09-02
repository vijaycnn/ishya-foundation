var momentz = require('moment-timezone');
const responder = require('../utils/responder');
const faqCategoryService = require('../services/faqCategory.service');
const moment = require('moment');

let FaqCategoryController = {

    getCategoryList: async (request, response, next) => {
        try {
            let data = await faqCategoryService.getFaqCategoryList(true);
            // console.log('rows', data.rows);

            let dataList =  { 'totalRecord': data.count, 'list': data.rows };
            // console.log('lit', dataList);

            return responder.sendFilterResponse(response, 200, "success", dataList, "Category List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    getCategoryDDList: async (request, response, next) => {
        try {
            let categoryList = await faqCategoryService.getFaqCategoryList();
            return responder.sendResponse(response, 200, "success", categoryList, "Category List retrieved successfully.");
        } catch (error) {
            return next(error);
        }
    },
    
    createCategory: async (request, response, next) => {
        try {
            console.log('create controller reached', request.body, request.user);
            if(request.body.name.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            let checkIfExist = false;
            checkIfExist = await faqCategoryService.checkExistFaqCategory(request.body.name);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', "Category Already Exist");
            } else {
                const categoryData = {
                    name: request.body.name.trim(),
                    createdBy: request.user.userId
                };
                let categoryCreate = await faqCategoryService.createFaqCategory(categoryData);
                return responder.sendResponse(response, 200, "success", categoryCreate, "Category created successfully.");
                
            }
        } catch (error) {
            return next(error);
        }
    },
    getCategoryById:async(request, response, next) =>{
        try {
            let categoryId = request.params.categoryId;
            console.log('getById controller reached', request.params, request.user);

            const dataList = await faqCategoryService.getCategoryById(categoryId);
            if(dataList){
                return responder.sendResponse(response, 200, "success", dataList, "Category retrieved successfully.");
            }else{
                return responder.sendResponse(response, 200, "error", {}, "No Category found");
            }
        } catch (error) {
            return next(error);
        }
    },
    updateCategory: async (request, response, next) => {
        try {
            // console.log('update controller reached', request.body, request.user);
            if(request.body.name.trim() == ''){
                return responder.sendResponse(response, 200, "error", '', "Missing Required!");
            }
            let checkIfExist = false;
            checkIfExist = await faqCategoryService.checkExistFaqCategory(request.body.name, request.body.categoryId);
            if (checkIfExist == true) {
                return responder.sendResponse(response, 200, "error", '', "Category Already Exist");
            } else {
                const categoryData = {
                    name: request.body.name.trim(),
                    updatedBy: request.user.userId,
                    updatedAt: new Date(),
                };
                let categoryUpdate = await faqCategoryService.updateFaqCategory(categoryData, request.body.categoryId);
                return responder.sendResponse(response, 200, "success", categoryUpdate, "Category updated successfully.");
                
            }
        } catch (error) {
            return next(error);
        }
    },
    changeCategoryStatus: async (request, response, next) => {
        try {
            // console.log('changeCategoryStatus reached', request.body, request.user);        
            const categoryData = {
                status: request.body.status,
                categoryId: request.body.categoryId,
            };
            let categoryUpdate = await faqCategoryService.changeFaqCategoryStatus(categoryData);
            return responder.sendResponse(response, 200, "success", categoryUpdate, "Category updated successfully.");            
        } catch (error) {
            return next(error);
        }
    },


};

module.exports = FaqCategoryController;
