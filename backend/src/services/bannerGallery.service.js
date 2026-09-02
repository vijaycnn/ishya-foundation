const { QueryTypes } = require('sequelize');
var fs = require('fs'),
  async = require('async')
let BannerGalleryDataProvider = {

  createBannerGallery: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.BannerGalleries.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  
  getBannerCategoryById: async (categoryId) => {
    return new Promise(function (resolve, reject) {
      conn.BannerGalleries.findOne({
        attributes: [ "*",['fileUrl', 'filePath']],
        where: { id: categoryId },
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
  updateBannerGallery: async (body, categoryId) => {
    return new Promise(function (resolve, reject) {
      conn.BannerGalleries.update(body, {
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
  changeBannerGalleryStatus: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.BannerGalleries.update({
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
  deleteBannerGallery: async (categoryId) => {
    return new Promise(function (resolve, reject) {
      conn.BannerGalleries.update({
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
  getBannerGalleryList: async (req, all = false) => {
    let offset = req.query.offset;
    let limit = req.query.perPage;
    return new Promise(async function (resolve, reject) {
      // console.log('search', search);
      let filter = { isdeleted: 0 };
      let columns = ["id", "type", "title", "fileUrl", "description", "status", "createdAt"];
      let orderBy = [['id', 'DESC']];
      if(!all){
        columns = ["id", "type", "title", "fileUrl", "description",];
        filter = {...filter, status:1}
        // orderBy = [['name', 'ASC']]
      }
      await conn.BannerGalleries.findAndCountAll({
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
module.exports = BannerGalleryDataProvider;
