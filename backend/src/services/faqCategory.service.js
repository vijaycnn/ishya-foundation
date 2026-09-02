const { QueryTypes } = require('sequelize');
var fs = require('fs'),
  async = require('async'),
  csv = require('csv');
const { off } = require('process');
let FaqCategoryDataProvider = {

  createFaqCategory: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.FaqCategories.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  checkExistFaqCategory: async (name, id = 0) => {
    return new Promise(function (resolve, reject) {
      conn.FaqCategories.findOne({
        where: { 
          name: name.trim(),          
          id: { [Op.not]: id }       
        },
      })
        .then(data => {
          if (data == null) {
            resolve(false);
          } else if (id && data.length == 1) {
            resolve(false);
          } else {
            resolve(true);
          }
        }).catch(err => {
          reject(err);
        });
    });
  },
  getCategoryById: async (categoryId) => {
    return new Promise(function (resolve, reject) {
      conn.FaqCategories.findOne({
        where: { id: categoryId },
      })
        .then(data => {
          if (data !== null) {
            resolve(data);
          } else {
            reject(false);
          }
        }).catch(err => {
          reject(err);
        });
    });
  },
  updateFaqCategory: async (body, categoryId) => {
    return new Promise(function (resolve, reject) {
      conn.FaqCategories.update(body, {
        where: { id: categoryId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  
  //Use this service to soft delete purpose
  changeFaqCategoryStatus: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.FaqCategories.update({
        status: body.status
      }, {
        where: { id: body.categoryId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  deleteFaqCategory: async (categoryId) => {
    return new Promise(function (resolve, reject) {
      conn.FaqCategories.update({
        isdeleted : 1
      },{
        where: { id: categoryId },
      })
        .then(data => {
          if (data !== null) {
            resolve(data);
          } else {
            reject('No Record found');
          }
        }).catch(err => {
          reject(err);
        });
    });
  },
  //Use this service as to get ActiveDocumentList Only, using via filter options also
  getFaqCategoryList: async (all = false) => {
    return new Promise(async function (resolve, reject) {
      // console.log('search', search);
      let filter = { isdeleted: 0 };
      let columns = ["id", "name", "status", "createdAt"];
      let orderBy = [['id', 'DESC']];
      if(!all){
        columns = ["id", "name"];
        filter = {...filter, status:1}
        orderBy = [['name', 'ASC']]
      }
      await conn.FaqCategories.findAndCountAll({
        attributes:columns,
        where: filter,
        order: orderBy,
        // raw: true,
        // logging:console.log
      })
        .then(async data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  
};
module.exports = FaqCategoryDataProvider;
