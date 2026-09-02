const { QueryTypes } = require('sequelize');
var async = require('async');

let OtpDataProvider = {

  insertOTP: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.OneTimeCodes.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  getOTP: async (contactNumber, verifiedStatus = 1) => {
    return new Promise(function (resolve, reject) {
      conn.OneTimeCodes.findOne({
        where: { phone: contactNumber.trim(), verified : verifiedStatus },     //get only pending otp entry here (verified ::: 1)
        raw:true,
        // logging: console.log
      })
        .then(data => {
          if (data !== null) {
            resolve(data);
          } else {
            resolve(false)
          }
        }).catch(err => {
          reject(err);
        });
    });
  },
  updateOTP: async (body, id) => {
    return new Promise(function (resolve, reject) {
      conn.OneTimeCodes.update( body, {
        where: { id: id },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  
  //Use this service to inactive previous otp enteries (verified ::: 3)
  deleteOTP: async (contactNumber) => {
    return new Promise(function (resolve, reject) {
      conn.OneTimeCodes.update({
        verified: 3
      }, {
        where: { phone: contactNumber },
      })
        .then(data => {
          resolve(true);
        }).catch(err => {
          reject(err);
        });
    });
  },
  
};
module.exports = OtpDataProvider;
