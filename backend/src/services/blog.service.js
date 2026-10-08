const { QueryTypes } = require('sequelize');
var fs = require('fs'),  csv = require('csv');

let DataProvider = {

  getList: async (all = false) => {
    return new Promise(async function (resolve, reject) {
      // console.log('search', search);
      let filter = {  };
      let columns = ["id", "slug", "title", "fileUrl", "remarks", "publishBy", "status", "publishAt"];
      if(!all){
        columns = ["id", "slug", "title", "fileUrl", "remarks", "publishAt", "publishBy" ];
        filter = {...filter, status:1}
      }
      await conn.Blogs.findAndCountAll({
        attributes:columns,
        where: filter,
        order: [ ['id', 'DESC']],
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
      conn.Blogs.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  checkExist: async (slug, title, id = 0) => {
    return new Promise(function (resolve, reject) {
      conn.Blogs.findOne({
        where: { 
          slug : slug.trim(),  
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
  getById: async (blogId) => {
    return new Promise(function (resolve, reject) {
      conn.Blogs.findOne({
        attributes: [ "*", ['fileUrl', 'filePath'] ],
        where: { id: blogId },
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
  getBySlug: async (slug) => {
    return new Promise(function (resolve, reject) {
      conn.Blogs.findOne({
        attributes: [ "*", ['fileUrl', 'filePath'] ],
        where: { slug: slug },
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
  update: async (body, blogId) => {
    return new Promise(function (resolve, reject) {
      conn.Blogs.update(body, {
        where: { id: blogId },
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
      conn.Blogs.update({
        status: body.status
      }, {
        where: { id: body.blogId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  
  
};
module.exports = DataProvider;
