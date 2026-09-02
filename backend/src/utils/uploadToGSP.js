/***********Start Code Move file S3 bucket ***********/
/*******Imports the Google Cloud client library *******/
const path = require("path");

const { Storage } = require("@google-cloud/storage");

const gspStorage = new Storage({
  keyFilename: path.join(
    __dirname + "../../../config",
    process.env.GCS_KEY_FILE_NAME
  ),
  projectId: process.env.GCS_PROJECT_ID,
});
function camelize(str) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, "");
}
async function createBucket(bucketName) {
    await gspStorage.createBucket(bucketName);
    console.log(`Bucket ${bucketName} created.`);
}
  
async function uploadEncryptedFile(bucketName,filePath, destFileName,  key) {
  const options = {
    destination: destFileName,
    // encryptionKey: Buffer.from(key, 'base64'),
  };
  let respo = await gspStorage.bucket(bucketName).upload(filePath, options);
  return respo;
  // .then(()=>{
  //   console.log(`File ${filePath} uploaded to gs://${bucketName}/${destFileName}`);
  // } );
}

module.exports.moveFiletoGsp = async function (bucketName, filePath, destFileName, key) {
  const bucket = gspStorage.bucket(bucketName);
  return await bucket.exists().then(async function (data) {
    const exists = data[0];
    if (!exists) {
      console.log("BUCKET NOT EXIST");
      await createBucket(bucketName).catch(console.error);
    } else {
      console.log("BUCKET  EXIST");
    }
    let uploadFileResult = await uploadEncryptedFile(
      bucketName,
      filePath,
      destFileName,
      key
    ).catch(console.error);

    //console.log("uploadFile Result", uploadFileResult);

    return uploadFileResult;
    // if(uploadFileResult){
    // console.log("uploadFile Result SUCCESS",)
    //   return true;
    // }else{
    // console.log("uploadFile Result FAIL")
    //   return false;
    // }
  });
  //uploadEncryptedFile().catch(console.error);
  // [END storage_upload_encrypted_file]
}
