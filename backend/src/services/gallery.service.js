const { QueryTypes } = require('sequelize');
var fs = require('fs'),
  async = require('async');
let GalleryDataProvider = {

  createGallery: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.Galleries.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  
  getGalleryById: async (galleryId) => {
    return new Promise(function (resolve, reject) {
      conn.Galleries.findOne({
        attributes: [ "*",['fileUrl', 'filePath']],
        where: { id: galleryId },
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
  updateGallery: async (body, galleryId) => {
    return new Promise(function (resolve, reject) {
      conn.Galleries.update(body, {
        where: { id: galleryId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  
  //Use this service to soft delete purpose
  changeGalleryStatus: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.Galleries.update({
        status: body.status
      }, {
        where: { id: body.galleryId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  deleteGallery: async (galleryId) => {
    return new Promise(function (resolve, reject) {
      conn.Galleries.update({
        isdeleted : 1
      },{
        where: { id: galleryId },
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
  //Use this service as to get List Only, using via filter options also
  getGalleryList: async (req, all = false) => {
    let offset = req.query.offset;
    let limit = req.query.perPage;
    let type = req.query.galleryType ? req.query.galleryType.trim() : '';
    let galleryStatus = req.query.galleryStatus ? req.query.galleryStatus.trim() : '';
    return new Promise(async function (resolve, reject) {
      // console.log('search', search);
      let filter = { isdeleted: 0 };
      if(type == 'image' || type == 'video'){
        filter = {...filter, type };
      }
      let columns = ["id", "type", "title", "fileUrl", "remarks", "status", "createdAt"];
      let orderBy = [['id', 'DESC']];
      if(!all){
        columns = ["id", "type", "title", "fileUrl", "remarks",];
        filter = {...filter, status:1}
      }else if(galleryStatus > 0){
        if(galleryStatus == 1){
          filter = {...filter, status:1}
        }else{
          filter = {...filter, status:0}
        }
      }
      await conn.Galleries.findAndCountAll({
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
module.exports = GalleryDataProvider;
