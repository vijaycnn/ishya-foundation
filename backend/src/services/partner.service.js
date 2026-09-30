const { QueryTypes } = require('sequelize');

let DataProvider = {

  createPartner: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.Partners.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  
  getPartnerById: async (partnerId) => {
    return new Promise(function (resolve, reject) {
      conn.Partners.findOne({
        attributes: [ "*",['fileUrl', 'filePath']],
        where: { id: partnerId },
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
  updatePartner: async (body, partnerId) => {
    return new Promise(function (resolve, reject) {
      conn.Partners.update(body, {
        where: { id: partnerId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  
  //Use this service to soft delete purpose
  changePartnerStatus: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.Partners.update({
        status: body.status
      }, {
        where: { id: body.partnerId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  //Use this service as to get List Only, using via filter options also
  getPartnerList: async (req, all = false) => {
    let offset = req.query.offset;
    let limit = req.query.perPage;
    let galleryStatus = req.query.galleryStatus ? req.query.galleryStatus.trim() : '';
    return new Promise(async function (resolve, reject) {
      // console.log('search', search);
      let filter = {  };
      
      let columns = ["id", "fileUrl",  "status", "createdAt"];
      let orderBy = [['id', 'DESC']];
      if(!all){
        columns = ["id", "fileUrl",];
        filter = {...filter, status:1}
      }else if(galleryStatus > 0){
        if(galleryStatus == 1){
          filter = {...filter, status:1}
        }else{
          filter = {...filter, status:0}
        }
      }
      await conn.Partners.findAndCountAll({
        attributes:columns,
        where: filter,
        limit: limit,
        offset: offset,
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
module.exports = DataProvider;
