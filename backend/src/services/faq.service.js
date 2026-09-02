const { QueryTypes } = require('sequelize');
var fs = require('fs'),  csv = require('csv');

let FaqDataProvider = {


  getFaqList: async (req, all = false) => {
    return new Promise(async function (resolve, reject) {
      let offset = req.query.offset;
      let limit = req.query.perPage;
    
      // console.log('search', search);
      let filter = { isdeleted: 0 };
      let columns = ["id", "categoryId", "quest", "answer", "orderNumber", "status", "createdAt"];
      if(!all){
        columns = ["id", "categoryId", "quest", "answer", "orderNumber"];
        filter = {...filter, status:1}
      }
      await conn.Faqs.findAndCountAll({
        attributes:columns,
        where: filter,
        include:[
            {
                model: conn.FaqCategories,
                attributes: [['name', 'category'] ],
                required: true
            },            
        ],
        limit: limit,
        offset: offset,
        order: [['categoryId', 'ASC'], ['orderNumber', 'ASC']],
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
  createFaq: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.Faqs.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  checkExistFaq: async (categoryId, quest, id = 0) => {
    return new Promise(function (resolve, reject) {
      conn.Faqs.findOne({
        where: { 
          categoryId : categoryId,  
          quest: quest.trim(),          
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
  getFaqById: async (faqId) => {
    return new Promise(function (resolve, reject) {
      conn.Faqs.findOne({
        include:[
            {
                model: conn.FaqCategories,
                attributes: [['name', 'category'] ],
                required: true
            },            
        ],
        where: { id: faqId },
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
  updateFaq: async (body, faqId) => {
    return new Promise(function (resolve, reject) {
      conn.Faqs.update(body, {
        where: { id: faqId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  
  //Use this service to soft delete purpose
  changeFaqStatus: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.Faqs.update({
        status: body.status
      }, {
        where: { id: body.faqId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  deleteFaq: async (faqId) => {
    return new Promise(function (resolve, reject) {
      conn.Faqs.update({
        isdeleted : 1
      },{
        where: { id: faqId },
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
  
  
};
module.exports = FaqDataProvider;
