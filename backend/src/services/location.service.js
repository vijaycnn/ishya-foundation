const { QueryTypes } = require('sequelize');
let LocationDataProvider = {

  getStateList: async () => {
    return new Promise(function (resolve, reject) {
      conn.StateMaster.findAll(
        {
        attributes: [ 'id', 'name'],
        where: { status: 0 }, raw: true, order: [['name', 'ASC']] })
        .then(async data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },

  getByStateCity: async (stateId) => {
    return new Promise(function (resolve, reject) {
      conn.CityMaster.findAll({
        attributes: [ 'id', 'name'],
        where: { stateId: stateId, status: 0},
        order: [['name', 'ASC']]
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },

}

module.exports = LocationDataProvider;
