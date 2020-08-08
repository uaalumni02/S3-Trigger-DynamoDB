"use strict";
const Dynamo = require("./lib/Dynamo");
const CryptoJS = require("crypto-js");
const { tableName } = process.env;

module.exports.hello = async (event) => {
  console.log("S event", JSON.stringify(event));

  let hash = CryptoJS.SHA256("Message");
  let ID = hash.toString(CryptoJS.enc.Hex);

  const filename = event.Records[0].s3.object.key;
  const filesize = event.Records[0].s3.object.size;

  const fileData = await Dynamo.write(
    { ID: ID, filename, filesize },
    tableName
  ).catch((err) => {
    console.log("error in dynamo write", err);
    return null;
  });

  if (!fileData) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Failed to write fileData" }),
    };
  }

  return {
    success: true,
  };
};
