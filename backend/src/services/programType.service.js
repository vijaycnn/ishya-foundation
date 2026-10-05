const { QueryTypes } = require('sequelize');

let DataProvider = {
  //Use this service as to get ActiveTypeList Only, using via filter options also
  getTypeList: async (all = false) => {
    return new Promise(async function (resolve, reject) {
      let filter = {  };
      let columns = ["id", "name", "status", "createdAt"];
      let orderBy = [['id', 'DESC']];
      if(!all){
        columns = ["id", "name"];
        filter = {...filter, status:1}
        orderBy = [['name', 'ASC']]
      }
      await conn.ProgramTypes.findAll({
        attributes:columns,
        where: filter,
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
  createProgramType: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.ProgramTypes.create(body)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  checkExistProgramType: async (name, id = 0) => {
    return new Promise(function (resolve, reject) {
      conn.ProgramTypes.findOne({
        where: { 
          name: name.trim(),          
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

  getTypeById: async (typeId) => {
    return new Promise(function (resolve, reject) {
      conn.ProgramTypes.findOne({
        where: { id: typeId },
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
  updateProgramType: async (body, typeId) => {
    return new Promise(function (resolve, reject) {
      conn.ProgramTypes.update(body, {
        where: { id: typeId },
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  
  //Use this service to soft delete purpose
  changeProgramTypeStatus: async (body) => {
    return new Promise(function (resolve, reject) {
      conn.ProgramTypes.update({
        status: body.status
      }, {
        where: { id: body.typeId },
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
