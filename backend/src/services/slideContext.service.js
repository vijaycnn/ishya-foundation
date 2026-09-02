const { QueryTypes } = require('sequelize');

let SlideContextDataProvider = {

  getSlideContextList: async (all = false) => {
    return new Promise(async function (resolve, reject) {
      // console.log('search', search);
      let filter = { isdeleted: 0 };
      let columns = ["id", "slideNumber", "title", "subtitle", "remark", "status", "createdAt"];
      if(!all){
        columns = ["id", "slideNumber", "title", "subtitle", "remark"];
        filter = {...filter, status:1 }
      }
      await conn.SlideContexts.findAndCountAll({
        attributes:columns,
        where: filter,
        order: [['id', 'DESC']],
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
  createSlideContext: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.SlideContexts.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  checkExistSlideContext: async (slideNumber, id = 0) => {
    return new Promise(function (resolve, reject) {
      conn.SlideContexts.findOne({
        where: { 
          slideNumber : slideNumber.trim(),
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
  getSlideContextById: async (slideId) => {
    return new Promise(function (resolve, reject) {
      conn.SlideContexts.findOne({
        attributes: [ "*"],
        where: { id: slideId },
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
  updateSlideContext: async (body, slideId) => {
    return new Promise(function (resolve, reject) {
      conn.SlideContexts.update(body, {
        where: { id: slideId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  
  //Use this service to soft delete purpose
  changeSlideContextStatus: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.SlideContexts.update({
        status: body.status
      }, {
        where: { id: body.slideId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  deleteSlideContext: async (slideId) => {
    return new Promise(function (resolve, reject) {
      conn.SlideContexts.update({
        isdeleted : 1
      },{
        where: { id: slideId },
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
module.exports = SlideContextDataProvider;
