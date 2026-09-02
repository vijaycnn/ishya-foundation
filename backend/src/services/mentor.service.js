const { QueryTypes } = require('sequelize');
var fs = require('fs'),  csv = require('csv');

let MentorDataProvider = {

  getMentorList: async (all = false) => {
    return new Promise(async function (resolve, reject) {
      // console.log('search', search);
      let filter = { isdeleted: 0 };
      let columns = ["id", "name", "title", "fileUrl", "remark1", "remark2", "orderNumber", "status", "createdAt"];
      if(!all){
        columns = ["id", "name", "title", "fileUrl", "remark1", "remark2"];
        filter = {...filter, status:1}
      }
      await conn.Mentors.findAndCountAll({
        attributes:columns,
        where: filter,
        order: [['orderNumber', 'ASC'], ['id', 'ASC']],
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
  createMentor: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.Mentors.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  checkExistMentor: async (name, title, id = 0) => {
    return new Promise(function (resolve, reject) {
      conn.Mentors.findOne({
        where: { 
          name : name.trim(),  
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
  getMentorById: async (mentorId) => {
    return new Promise(function (resolve, reject) {
      conn.Mentors.findOne({
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
  updateMentor: async (body, mentorId) => {
    return new Promise(function (resolve, reject) {
      conn.Mentors.update(body, {
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
  changeMentorStatus: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.Mentors.update({
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
  deleteMentor: async (mentorId) => {
    return new Promise(function (resolve, reject) {
      conn.Mentors.update({
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
module.exports = MentorDataProvider;
