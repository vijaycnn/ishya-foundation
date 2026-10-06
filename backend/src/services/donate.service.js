const { QueryTypes } = require('sequelize');
let DataProvider = {

  getPageData: async () => {
    return new Promise(async function (resolve, reject) {
      let filter = { status: 1,};
      
      await conn.Donates.findAndCountAll({
        where: filter,
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
  
  addDonate: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.Donates.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  editDonate: async (donateId, body) => {
    return new Promise(function (resolve, reject) {
      conn.Donates.update(body, {
        where: { id: donateId },
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
