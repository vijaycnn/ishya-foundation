const md5 = require('md5-nodejs');
const jwt = require('jsonwebtoken');
const moment = require("moment");
var crypto = require("crypto");
const helper = require('../utils/helper');
const responder = require('../utils/responder');
const usersService = require('../services/users.service');

let userController = {

  loginUser: async (request, response, next) => {
    try {
    console.log(":::", request.body)
      let password=  request.body.password;
      let email=  request.body.email;

      if(email == '' || password == ''){
        return responder.sendResponse(response, 400, "error", null, "Password and email can't be empty.");
      }
      let base64string = request.body.password;
      let bufferObj = Buffer.from(base64string, "base64");
      let decodedString = bufferObj.toString("utf8");

     // console.log("decoded data---->",decodedString)
 
      if(decodedString=='' || email=='' || password == '')
       {
        return responder.sendResponse(response, 400, "error", null, "Password and email can't be empty.");
       }
       else{
            // var hash = md5(password).toString();
            var hash = md5(decodedString).toString();
            // console.log('has>> ', hash);
            const userData = {
                userEmail      : request.body.email,
                userPassword   : hash,
                isDeleted      :  0,                
            };
            let findUser = await usersService.loginUser(userData);
            /// console.log("find user ",findUser)
            if((findUser!==null) && (findUser.id!==''))
            {
                if(findUser.status==1){
                    let user={
                        userName:findUser.userName,
                        userEmail:findUser.userEmail,
                        userId: findUser.id,
                    }
                // console.log("USER JWT ::",user)
                let token= await genereateToken(user);

                // let permissions = JSON.parse((findUser.Role).role_permissions);
                let userPermission = {};    //await usersService.findAllPermissionGivenUser(null,permissions);
                return responder.sendResponse(response, 200, "success", {type:"activated",token:token,userName:findUser.userName, userEmail:findUser.userEmail, userId: findUser.id, userPermission:userPermission}, "Valid User login.");
                }else{
                return responder.sendResponse(response, 200, "error", {type:"deactivated"}, "This user deactivated please contact to admin");
                }   
            }
            else{
                return responder.sendResponse(response, 200, "error", {type:"Unauthorized"}, "Unauthorized User.");
            }              
       }    
    } catch (error) {
            console.log(error)
            return next(error);
      }
  },
  regenerateToken: async (request, response, next) => {
    try {
    // console.log("HHHHHHHHHHHHHHHHHHHHHH")
      let refreshToken=  request.body.refreshToken;     
      if(!refreshToken)
       {
        return responder.sendResponse(response, 400, "false", null, "Refresh Token Required");
       }
       else{

         let  refdata= await verifyRefreshToken(refreshToken);
         console.log("refresh token data",refdata)
         let userId= refdata.userId;
         if(userId)
         {
          //const expMin=getTokenExpiresIn(refdata.exp);		  
		  
		let issuedEpoch = parseInt(refdata.iat);
		let expEpoch = parseInt(refdata.exp);
		let currentEpoch = parseInt(moment().unix());
		
		let issuedEpochDiff = currentEpoch - issuedEpoch;
		let expEpochDiff = expEpoch - currentEpoch;

		if(issuedEpochDiff > 60 && expEpochDiff > 0){
            let findUser = await usersService.loginUser(userId);
            console.log("find user ",findUser);
            if((findUser!==null) && (findUser.id!==''))
               {
                    if(findUser.status==1){
                       let user={
                            userName:findUser.userName,
                            userEmail:findUser.userEmail,
                            userId: findUser.id,
                        }
                        let token= await genereateToken(user);
                       
                        // let permissions = JSON.parse((findUser.Role).role_permissions);
                        let userPermission = {};    //await usersService.findAllPermissionGivenUser(null,permissions);
                        // userPermission=userPermission.permissions;
                        return responder.sendResponse(response, 200, "true", {type:"activated",token:token}, "Regenerate token  successfully");
                    }else{
                        return responder.sendResponse(response, 200, "false", {type:"deactivated"}, "This user deactivated please contact to admin");
                    }   
                }
          }
          else{          
            return responder.sendResponse(response, 200, "true", {type:"activated",token:refreshToken}, "Token Not expired");
          }
        }else{
            return responder.sendResponse(response, 200, "false", {type:"Unauthorized"}, "Unauthorized User.");
        }              
       }    
    } catch (error) {
        console.log(error)
        return next(error);
    }
  },
  generateForgotPasswordLink: async (request, response, next) => {
    try {
   
      let emailId=  request.body.emailId;
      let  BackEndBaseUrl = process.env.BASE_URL_BACK_END;
      if(!emailId){
        return responder.sendResponse(response, 400, "false", null, "Email ID  Required");
      }else{
        let  userdata= await usersService.checkExistByEmail(emailId);       
         if(userdata){
             let userId= userdata.id;
             let userName= userdata.userName;
             crypto.randomBytes(20, async function (err, buf) {
             var token = buf.toString("hex");

            //  console.log("generated id ", token);
             if (err) {
               console.log(err);
             } else {
               let userData = {
                 userId: userId,
                 email: userdata.userEmail,
                 resetPasswordGenerated: new Date(),
                 resetPasswordToken: token,
                 status: 1,
                 resetPasswordExpires: moment()
                   .add(24, "hours")
                   .format("YYYY-MM-DD HH:mm:ss"),
               };

               let linkCreated = await usersService.createFotgotPasswordLink(userData);

               if (linkCreated) {
                 let link = BackEndBaseUrl + "/forgot-password-update/" + token;
                 console.log('link ::', link);                 

                 let templateDetails= await conn.Notifications.findOne({where: {stateSlug:'password-reset'}, raw:true});
                 if(templateDetails){
                    let emailTemplate = templateDetails.emailTemplate;
                    let replaceObj={
                      rm_CusName:userName,
                      rm_Link:link,                     
                    }
                    emailTemplate= await helper.stringReplace(emailTemplate,replaceObj)
                    //send mail to all assign mail
                    helper.send_mail_byEmailer(emailId,templateDetails.subjectLine, emailTemplate,[])
                 }
                 return responder.sendResponse(response, 200, "success", { token: token, da: linkCreated }, "Forgot password link sent successfully your registered email.");
               }
               else {
                 return responder.sendResponse(response, 200, "false", { type: "link not created" }, "link not created");
               }
             }

           })
         }
        else{
            return responder.sendResponse(response, 200, "false", {type:"Unauthorized"}, "Unauthorized User.");
        }
              
       }    
    } catch (error) {
      console.log(error)
      return next(error);
    }
  },
  forgotPasswordLinkVerify: async (request, response, next) => {
    try {
   // console.log(request)
      let tokenId=  request.params.id;     
      if(!tokenId)
       {
        return responder.sendResponse(response, 200, "false", {type:"link not valid"}, "Link is not valid");
       }
       else{
        let  userdata= await usersService.verifyForgotToken(tokenId);
      
        if(userdata && userdata.id)
        {            
            return responder.sendResponse(response, 200, "success", {type:"valid",userdata:userdata}, "Forgot Password link is valid");            
        }
        else{
            return responder.sendResponse(response, 200, "false", {type:"expired"}, "Password reset token is invalid or has expired.");
        }
              
       }    
    } catch (error) {
          console.log(error)
          return next(error);
    }
  },
  updateForgotPassword: async (request, response, next) => {
    try {
   
      let resetPasswordToken=  request.body.resetPasswordToken;
      let emailId=  request.body.emailId;
      let newPassword=  request.body.newPassword;
      let confirmPassword=  request.body.confirmPassword;

      // const pwdRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      const pwdRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

      if(!pwdRegex.test(newPassword)){
          return responder.sendResponse(response, 200, "false", null, "Password contains 1 Uppercase letter, 1 lowercase letter, 1 number, 1 special character and minimum length should be 8");
      }
     
      if(newPassword !== confirmPassword)
       {
        return responder.sendResponse(response, 200, "false", null, "New Password and confirm password not matched");
       }
       else{
        let  userdata= await usersService.verifyForgotToken(resetPasswordToken);
         if(userdata)
         {
          let userId= userdata.userId;
            confirmPassword= md5(confirmPassword).toString();
            let userData = {
              userPassword:confirmPassword,
              resetPasswordExpires: new Date(),
            };

            let where = {
              userEmail: emailId,
            };

            let userEdit = await usersService.updateForgotPassword(userData,where,userId,resetPasswordToken);
            if(userEdit)
            {
              return responder.sendResponse(response, 200, "success", {type:"password reset"}, "Password reset successfully");
            }
            else{
              return responder.sendResponse(response, 200, "false", {type:"password not reset"}, "Password not reset please try again");
            }
           
         }else{
            return responder.sendResponse(response, 200, "false", {type:"Unauthorized"}, " This link is not valid");
        }
              
       }    
    } catch (error) {
        console.log(error)
        return next(error);
    }
  },


};

genereateToken= async (data)=>{
  return new Promise(async function (resolve, reject) {

    // let expTimeData = await conn.Settings.findOne({where: {settingsKey:'token-expiry-time-minutes'}, raw:true});
    let ExpTime=15;
    // if(expTimeData && expTimeData.settingsKey!='' && expTimeData.settingsValue!='')
    // {
    //   ExpTime=expTimeData.settingsValue;
    // }

    jwt.sign(
      data,
      process.env.JWT_KEY,
      {
        expiresIn: ExpTime+"m",
      },(err,token)=>{
          if(err)
          {
            reject(err);
          }
          //store(user.userId, {token:token,blockedToken:null});
         
          resolve(token);
      }
    );
  })
}
genereateRefreshToken= async (data)=>{  
    return new Promise(function (resolve, reject) {
      jwt.sign(
        data,
        process.env.JWT_KEY,
        {
          expiresIn: "1y",
        },(err,token)=>{
            if(err)
            {
              reject(err);
            }
            resolve(token);
        }
      );
    })
}
module.exports = userController;
