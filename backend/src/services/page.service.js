const { QueryTypes } = require('sequelize');
let DataProvider = {

  getPageData: async (type, all = false) => {
    return new Promise(async function (resolve, reject) {
      let filter = { status: 1, name: type };
      
      await conn.PageMasters.findAndCountAll({
        where: filter,
        include: [
          {
            model: conn.PageBanners,
            attributes: ['id', 'pageId', 'type', 'fileUrl'],
            where: { status: 1},
            required: false
          },
          {
            model: conn.PageAbouts,
            where: { status: 1},
            required: false
          },
          {
            model: conn.PageMaps,
            where: { status: 1},
            required: false
          },
          {
            model: conn.PageVideos,
            where: { status: 1},
            required: false
          },
        ],
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

  ///////Page Banner service //////////////
  addBanner: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.PageBanners.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  editBanner: async (bannerId, body) => {
    return new Promise(function (resolve, reject) {
      conn.PageBanners.update(body, {
        where: { id: bannerId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  ///////End Page Banner  ////////////////

  ///////Page Map service //////////////
  addPagemap: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.PageMaps.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  editPagemap: async (id, body) => {
    return new Promise(function (resolve, reject) {
      conn.PageMaps.update(body, {
        where: { id: id },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  ///////End Page Map  ////////////////

  ///////Page About service //////////////
  addPageabout: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.PageAbouts.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  editPageabout: async (id, body) => {
    return new Promise(function (resolve, reject) {
      conn.PageAbouts.update(body, {
        where: { id: id },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  ///////End Page About  ////////////////
  
  ///////Page Video service //////////////
  addPagevideo: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.PageVideos.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  editPagevideo: async (videoId, body) => {
    return new Promise(function (resolve, reject) {
      conn.PageVideos.update(body, {
        where: { id: videoId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  ///////End Page Video  ////////////////


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
