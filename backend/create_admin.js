const dotenv = require('dotenv');
dotenv.config();


async function createAdmin(){
let conn = require("./models"); 
console.log("This function was called", process.env.PORT);
let result = await conn.Users.create({"id": 1,
"userName": "admin",
"userEmail": process.env.ADMIN_EMAIL,
"userMobile": process.env.ADMIN_MOBILE,
"userPassword": process.env.ADMIN_PASSWORD,
"userAddress": "default",
"roleId": 1,
"roleTypeId": 1,
"cityId": 2481,
"status": 1,
"isDeleted": 0,
"createdAt": "2022-04-20 18:49:13.062+05:30",
"updatedAt": "2022-05-20 18:31:12.863+05:30",
"createdBy": 1,
"updatedBy": 1,
"reportingManagerId": 0});

console.log("Admin created!", result);
}

createAdmin();



