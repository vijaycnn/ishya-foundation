const { QueryTypes } = require('sequelize');
let DataProvider = {

  getPageData: async () => {
    return new Promise(async function (resolve, reject) {
      let filter = { status: 1,};
      
      await conn.Contacts.findAndCountAll({
        where: filter,
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
  
  addContactus: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.Contacts.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  editContactus: async (contactId, body) => {
    return new Promise(function (resolve, reject) {
      conn.Contacts.update(body, {
        where: { id: contactId },
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
