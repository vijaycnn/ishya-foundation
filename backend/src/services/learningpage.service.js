const { QueryTypes } = require('sequelize');
var fs = require('fs'),  csv = require('csv');

let DataProvider = {

  getList: async (type, all = false) => {
    return new Promise(async function (resolve, reject) {
      // console.log('search', search);
      let filter = { isdeleted: 0, type: type };
      let columns = ["id", "type", "title", "fileUrl", "remark1", "remark2", "orderNumber", "status", "createdAt"];
      if(!all){
        columns = ["id", "type", "title", "fileUrl", "remark1" ];
        filter = {...filter, status:1}
      }
      await conn.LearningPages.findAndCountAll({
        attributes:columns,
        where: filter,
        order: [['orderNumber', 'ASC'], ['id', 'ASC']],
        // raw: true,
        logging:console.log
      })
        .then(async data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  create: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.LearningPages.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  checkExist: async (type, title, id = 0) => {
    return new Promise(function (resolve, reject) {
      conn.LearningPages.findOne({
        where: { 
          type : type.trim(),  
          title: title.trim(),          
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
  getById: async (mentorId) => {
    return new Promise(function (resolve, reject) {
      conn.LearningPages.findOne({
        attributes: [ "*",['fileUrl', 'filePath']],
        where: { id: mentorId },
        raw:true
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
  update: async (body, mentorId) => {
    return new Promise(function (resolve, reject) {
      conn.LearningPages.update(body, {
        where: { id: mentorId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  
  //Use this service to soft delete purpose
  changeStatus: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.LearningPages.update({
        status: body.status
      }, {
        where: { id: body.mentorId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  delete: async (mentorId) => {
    return new Promise(function (resolve, reject) {
      conn.LearningPages.update({
        isdeleted : 1
      },{
        where: { id: mentorId },
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
module.exports = DataProvider;
