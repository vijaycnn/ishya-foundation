const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const client = new S3Client({
  region: process.env.AWS_REGION,
  // credentials: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // }
});
//Call it with access and secret key
async function uploadBufferToS3(buffer, originalName, mimeType) {
  const bucket = process.env.S3_BUCKET;
  const basePath = process.env.S3_BASE_PATH || '';
  const ext = path.extname(originalName) || '';
  const key = `${basePath.replace(/\/$/, '')}/${uuidv4()}${ext}`.replace(/^\//, '');

  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    ACL: 'private'      // 'public-read'
  });

  await client.send(cmd);

  // public url (works for standard S3 public buckets); adjust if using CloudFront or private objects
  let filePath = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  let result =  { fileName: key , filePath};
  console.log('s3 res', result);
  return result;
}
//call it without access and secret key
async function uploadS3(buffer, originalName, mimeType) {
  const bucket = process.env.S3_BUCKET;
  const basePath = process.env.S3_BASE_PATH || '';
  const ext = path.extname(originalName) || '';
  const key = `${basePath.replace(/\/$/, '')}/${uuidv4()}${ext}`.replace(/^\//, '');

  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  await client.send(cmd);
  const uploadUrl = await getSignedUrl(client, cmd, {
      expiresIn: 60, // 5 minutes
    });

  // public url (works for standard S3 public buckets); adjust if using CloudFront or private objects
  let filePath = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  let result =  { fileName: key , filePath, uploadUrl};
  console.log('s3 res', result);
  return result;
}
async function listS3Objects(prefix = "") {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Prefix: prefix, // optional: list items under a specific folder
  };

  try {
    const data = await client.send(new ListObjectsV2Command(params));

    if (!data.Contents) {
      console.log("No objects found.");
      return [];
    }

    const items = data.Contents.map((item) => item.Key);
    console.log("✅ S3 Objects:", items);
    return items;
  } catch (err) {
    console.error("❌ Error listing objects:", err);
  }
}
module.exports = { uploadBufferToS3, listS3Objects };