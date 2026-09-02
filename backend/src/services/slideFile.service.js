const { QueryTypes } = require('sequelize');

let SlideFileDataProvider = {

  getSlideFileList: async (slideNumber, all = false) => {
    return new Promise(async function (resolve, reject) {
      // console.log('search', search);
      let filter = { isdeleted: 0 };
      let columns = ["id", "slideNumber", "fileUrl", "remark", "status", "createdAt"];
      if(slideNumber){
        filter = {...filter, slideNumber }
      }
      if(!all){
        columns = ["id", "slideNumber", "fileUrl", "remark"];
        filter = {...filter, status:1 }
      }
      await conn.SlideFiles.findAndCountAll({
        attributes:columns,
        where: filter,
        order: [['id', 'DESC']],
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
  createSlideFile: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.SlideFiles.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  checkExistSlideFile: async (slideNumber, id = 0) => {
    return new Promise(function (resolve, reject) {
      conn.SlideFiles.findOne({
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
  getSlideFileById: async (slideId) => {
    return new Promise(function (resolve, reject) {
      conn.SlideFiles.findOne({
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
  updateSlideFile: async (body, slideId) => {
    return new Promise(function (resolve, reject) {
      conn.SlideFiles.update(body, {
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
  changeSlideFileStatus: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.SlideFiles.update({
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
  deleteSlideFile: async (slideId) => {
    return new Promise(function (resolve, reject) {
      conn.SlideFiles.update({
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
module.exports = SlideFileDataProvider;
