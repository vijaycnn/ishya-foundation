const { QueryTypes } = require('sequelize');
let userDataProvider = {

  loginUser: async (userdata) => {
    return new Promise(function (resolve, reject) {
      conn.Users.findOne({
        where: userdata,
        attributes: { exclude: ['password'] },        
      })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  checkExistByEmail: async (userEmail) => {
    return new Promise(function (resolve, reject) {
      conn.Users.findOne({
        where: { userEmail: userEmail },
      })
        .then(data => {
          if (data == null) {
            resolve(null);
          } else {
            resolve(data);
          }
        }).catch(err => {
          reject(err);
        });
    });
  },
  createFotgotPasswordLink: async (data) => {
    console.log("edited data ",data)
    let userId=data.userId;
    return new Promise( async function (resolve, reject) {
      await conn.RestPasswords.update({resetPasswordExpires: new Date(),status:0}, { where: {userId:userId} });
      conn.RestPasswords.create(data)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },
  verifyForgotToken: async (token) => {
    return new Promise(function (resolve, reject) {
      conn.RestPasswords.findOne({
        where: { resetPasswordToken: token,  resetPasswordExpires: {
          [Op.gt]: conn.sequelize.literal("NOW()"),
        },status:1},
        attributes:['id','resetPasswordToken','userId','email']
      })
        .then(data => {
          if (data == null) {
            resolve(null);
          } else {
            resolve(data);
          }
        }).catch(err => {
          reject(err);
        });
    });
  },
  updateForgotPassword: async (editData, whereCon,userId,resetPasswordToken) => {

    return new Promise( async function (resolve, reject) {
      const t = await  conn.sequelize.transaction();
      try {
      
       console.log(userId,"udate reset pass word data",resetPasswordToken)
       let userData= await conn.Users.update(editData, { where: whereCon }, { transaction: t });
       await conn.RestPasswords.update({resetPasswordExpires: new Date(),status:0}, { where: {userId:userId,resetPasswordToken:resetPasswordToken} }, { transaction: t });
           
        await t.commit();
        resolve(userData);
      }
      catch (e) {
        console.log("error thrown", e);
        await t.rollback();
        reject(e);
      }
      conn.Users.update(editData, { where: whereCon })
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },

}

module.exports = userDataProvider;
