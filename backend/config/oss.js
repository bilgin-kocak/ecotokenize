const OSS = require("ali-oss");
require("dotenv").config();

const client = new OSS({
  region: "oss-eu-central-1", // e.g., 'oss-us-west-1'
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: "hackathonbilgin",
});

module.exports = client;
