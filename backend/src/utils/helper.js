const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const path = require("path");
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
var request = require("request");
const fetch = require("node-fetch"); 


// const opt = { credentials: require('amqplib').credentials.plain('neuro', 'Neuro@1009') };

var https = require('follow-redirects').https;

module.exports.getEmailSettings = async function () {
    let smsSettings = await conn.Settings.findAll({where: {settingsName: 'EMAIL'}, raw:true});
    let finalResult = {};
    if(smsSettings.length > 1){
        for(let i = 0; i < smsSettings.length; i++){
           let key = smsSettings[i].settingsKey;
           let value = smsSettings[i].settingsValue;
            finalResult = {
                ...finalResult,
                [key] : value
            }
        }
    }
    return finalResult;
}

module.exports.stringReplace = async function (str, replaceObj=null) {    
    var str1=str.replace(/rm_CusName|rm_Link|rm_phone|rm_DOB|rm_CityName|rm_Email|rm_Interest_in_role|rm_Story|rm_Dream|rm_StateName|rm_HowToKnow|rm_otp/gi, function(matched){
       if(replaceObj[matched])
       {
        return replaceObj[matched];
       }
       else{    return "";  }   
     });
     return str1;
}

module.exports.send_mail_byEmailer = async function (to, subject, emailer, ccto = [],attachments =[]){
    try{
        console.log("MAil Data :::",to, subject, emailer,ccto,attachments);

        let ceroInfoMail='vijayc@neuronimbus.com';
        let ceroInfoMailUser = null;
        let ceroInfoMailPass = null;
        let mailerIconsUrl= null;
        let  whereconsearch = { settingsKey: {
         [Op.or]: ['myousic-info-email', 'email-sender-id','email-sender-password','mailer-icons-url']
        }};
         let ceroInfoMaildata = await conn.Settings.findAll({where: whereconsearch, raw:true});
     
         if(ceroInfoMaildata && ceroInfoMaildata.length>0)
         {     
            for(let i=0;i<ceroInfoMaildata.length;i++)
            {
                if(ceroInfoMaildata[i] && ceroInfoMaildata[i].settingsKey && ceroInfoMaildata[i].settingsKey=='cero-info-email')
                {
                    ceroInfoMail =  ceroInfoMaildata[i].settingsValue?ceroInfoMaildata[i].settingsValue:"";
                }

                if(ceroInfoMaildata[i] && ceroInfoMaildata[i].settingsKey && ceroInfoMaildata[i].settingsKey=='email-sender-id')
                {
                    ceroInfoMailUser =  ceroInfoMaildata[i].settingsValue?ceroInfoMaildata[i].settingsValue:"";
                }

                if(ceroInfoMaildata[i] && ceroInfoMaildata[i].settingsKey && ceroInfoMaildata[i].settingsKey=='email-sender-password')
                {
                    ceroInfoMailPass =  ceroInfoMaildata[i].settingsValue?ceroInfoMaildata[i].settingsValue:"";
                }

                if(ceroInfoMaildata[i] && ceroInfoMaildata[i].settingsKey && ceroInfoMaildata[i].settingsKey=='mailer-icons-url')
                {
                    mailerIconsUrl =  ceroInfoMaildata[i].settingsValue?ceroInfoMaildata[i].settingsValue:"";
                }
            }     
         }
         console.log("MAil Data  Reached 1:::");
        if(ceroInfoMailUser  && ceroInfoMailPass) {
            console.log("MAil Data  Reached 2:::");
            let mailTransporter = nodemailer.createTransport(smtpTransport({
                host: 'smtp.office365.com',
                port: 587,
                auth: {
                    user: ceroInfoMailUser,
                    pass: ceroInfoMailPass
                }
            }));
            ccto.push(ceroInfoMail);
            console.log("MAil Data  Reached 3:::");
            var finalHtml = emailer;    //await emailerTemplate(emailer,mailerIconsUrl);
            let mailDetails = {
                from: ceroInfoMailUser, // sender address
                to: to,
                cc: ccto, // list of receivers
                // bcc: '',
                subject: subject,//'Test QR code in Email Node JS', // Subject line
                // text: data, //Hello just testing node js', // plain text body
                html: finalHtml
            };

            console.log("MAil Data  Reached 4:::");
            if(attachments.length > 0){
                mailDetails.attachments = attachments;
            }
            //console.log('Email sent successfully  ============================================');
            return new Promise((resolve, reject) => {
            console.log("MAil Data  Reached 5::: Subject:",subject,"email",emailer);
            
            if(subject && emailer){
                console.log("MAil Data  Reached 6:::");
                mailTransporter.sendMail(mailDetails).then(info => {
                    console.log('Email sent successfully',info);
                    return resolve(true);
                }).catch(err => {
                    console.log('Error Occurs when send email:' + err);
                    return resolve(true);
                });                                
            }
            else{
                console.log("MAil Data  Reached 7:::");
                return resolve(true);                        
            }    
            });
        }// mail credential 
        else{
            console.log("MAil Data  Reached 8:::");
             return new Promise((resolve, reject) => {
                 return resolve(true);
             })
        }
    }catch(err){
        console.error("MAil ERROR ::::",err)
    }
}

module.exports.send_sms = async function (mobile_no, smsTemplate, template_Id){
    try{
        console.log("SMS Data :::",mobile_no, smsTemplate, template_Id);

        let sms_gateway_url = '';
        let sms_app_name = '';

        let  whereconsearch = { settingsKey: {
         [Op.or]: ['sms-api-url', 'sms-app-name']
        }};
         let ceroInfoSMSdata = await conn.Settings.findAll({where: whereconsearch, raw:true});
     
         if(ceroInfoSMSdata && ceroInfoSMSdata.length>0)
         {     
            for(let i=0;i<ceroInfoSMSdata.length;i++)
            {
                if(ceroInfoSMSdata[i] && ceroInfoSMSdata[i].settingsKey && ceroInfoSMSdata[i].settingsKey=='sms-api-url')
                {
                    sms_gateway_url =  ceroInfoSMSdata[i].settingsValue?ceroInfoSMSdata[i].settingsValue:"";
                }
                if(ceroInfoSMSdata[i] && ceroInfoSMSdata[i].settingsKey && ceroInfoSMSdata[i].settingsKey=='sms-app-name')
                {
                    sms_app_name =  ceroInfoSMSdata[i].settingsValue?ceroInfoSMSdata[i].settingsValue:"";
                }
            }     
         }
         console.log("SMS Data  Reached 1:::");
        if(sms_gateway_url != '' && sms_app_name) {
            console.log("SMS Data  Reached 2:::");

            const requestBody = {
                "mobileNumber": mobile_no,
                "message": smsTemplate,
                "template_Id": template_Id,
                "appName": sms_app_name,
                "messageType": "1",
                "isOtp": false
            };
            console.log('SMS BODY: ',requestBody)        
            const fetchOptions = {
                method: 'post',
                body: JSON.stringify(requestBody),
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            };            
            // fetch(sms_gateway_url, fetchOptions)
            //     .then((response) => response.json())
            //     .then((json) => {
            //     console.log('SMS ----------------', json)
            //     })
            //     .catch((error) => {
            //     console.log({ data: error });
               
            //  });
            try {
                const response = await fetch(sms_gateway_url, fetchOptions);

                console.log("Status:", response.status);

                const text = await response.text();

                console.log(text);

            } catch(err) {
                console.error(err);
            }                
            //console.log('SMS sent successfully  ============================================');
            
        }// SMS credential 
        else{
            console.log("SMS Data  Reached 8:::");
             return new Promise((resolve, reject) => {
                 return resolve(true);
             })
        }
    }catch(err){
        console.error("SMS ERROR ::::",err)
    }
}

async function emailerTemplate(myhtml, root=null){
    //var root=process.env.MAILER_ICONS_URL;
    var template = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
    +'<html xmlns="https://www.w3.org/1999/xhtml">'
    +'<head>'
    +'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'
    +'<title>Mahindra Cero</title>'
     + '<link rel="preconnect" href="https://fonts.googleapis.com">'
    +'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        +'<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">'
    +'<style type="text/css">'
    	+'* { margin: 0; padding: 0; }'
   +' </style>'
  +'</head>'
  +'<body>'
  	+'<table cellspacing="0" cellpadding="0" width="100%;" style="font-family: "Montserrat", Arial, sans-serif; color:#2d2c2b; border-spacing: 0; border-collapse: collapse; border: none; overflow:hidden; background:#6db784;">'
  		+'<tr>'
  			+'<td align="center" style="background:#6db784;">'
  				+'<table width="620" cellspacing="0" cellpadding="0" align="center" border="0" style="font-family: "Montserrat", Arial, sans-serif; color:#2d2c2b; border-spacing: 0; border-collapse: collapse; border: none; overflow:hidden;" bgcolor="#ffffff">'
    	 +'<tr>'
			 		+'<td height="40" style="background:#6db784;">&nbsp;</td>'
			 	+'</tr>'
    	+'<tr>'
    		+'<td>'
    			 +'<table width="620" cellspacing="0" cellpadding="0" align="center" border="0" style="font-family: "Montserrat", Arial, sans-serif; color:#2d2c2b; border-spacing: 0; border-collapse: collapse; border: none; overflow:hidden; ">'
    			 	+'<tr>'
    			 		+'<td colspan="3" height="20">&nbsp;</td>'
    			 	+'</tr>'
  			 		 +'<tr>'
			      	+'<td width="30">&nbsp;</td>'
			      	+'<td><img src="'+root+'/img/logo.svg" alt="cero image" width="80"></td>'
			      	+'<td width="30">&nbsp;</td>'
			     +'</tr>'
			      +'<tr>'
    			 		+'<td colspan="3" height="20">&nbsp;</td>'
    			 	+'</tr>'
    			+' </table>'
    		+'</td>'
    	+'</tr>'
    	+'<tr>'
    		+'<td>'
    			 +'<table width="620" cellspacing="0" cellpadding="0" align="center" border="0" style="font-family: "Montserrat", Arial, sans-serif; color:#444; font-size: 13px; line-height: 22px; border-spacing: 0; border-collapse: collapse; border: none; overflow:hidden; background:#ffffff;">'
    			 	+'<tr>'
    			 		+'<td colspan="3" height="30">&nbsp;</td>'
    			 	+'</tr>'
  			 		+' <tr>'
			      	+'<td width="30">&nbsp;</td>'
                     +' <td>'
                     +myhtml
                 
                  +'</td>'
			      	+'<td width="30">&nbsp;</td>'
			      +'</tr>'
			      +'<tr>'
    			 		+'<td colspan="3" height="30">&nbsp;</td>'
    			 	+'</tr>'
    			 +'</table>'
    		+'</td>'
    	+'</tr>'
        +'<tr>'
           +' <td align="center" style=" background:#0484C4;">'
               + '<table width="60%" cellpadding="10" style="background: #0484C4; text-align: center">'
                    +'<tr>'
                        +'<td colspan="2">&nbsp;'
                                                      
                        +'</td> '                       
                    +'</tr>'
                +'</table>'
                              
          +  '</td>  '                 
       +' </tr>'
       +' <tr>'
          +'  <td align="center" style=" background:#0484C4;">'
                +'<table width="50%" cellpadding="0" style="background: #ffffff; text-align: center">'
                    
                  + ' <tr>'
                       +' <td align="center">'
                           +' <img src="'+root+'/img/mahindraAcceloLogo.svg" width="160" alt=""> '                           
                        +'</td>'
                        +'<td align="center">'
                            +'<img src="'+root+'/img/mstcLogo.svg" width="90" alt="">'  
                       +' </td>'
                    +'</tr>'
                    
                +'</table> '                             
           +' </td>'                   
        +'</tr>'
       + '<tr>'
            +'<td style="text-align: center; font-size: 12px; background:#0484C4; color: #fff"><br>A Mahindra Accelo &amp; MSTC Venture <br><br><br></td>'
       +' </tr>'
        
    	+'<tr>'
			 		+'<td height="10" style="background:#6db784;">&nbsp;</td>'
			 	+'</tr>'	
    	+'<tr>'
		 		+'<td style="background:#6db784; text-align: center; font-size: 12px; color: #fff;">&copy; 2022 Mahindra MSTC Recycling Pvt. Ltd. All Rights Reserved</td>'
		 	+'</tr>'
    		+'<tr>'
			 		+'<td height="40" style="background:#6db784;">&nbsp;</td>'
			 	+'</tr>'	
		
  +'  </table>'
  		+'	</td>'
  		+'</tr>'
  	+'</table>'
    
 +' </body>'
+'</html>';

    return template;
}
