'use strict';

console.log('Loading function');

const aws = require('aws-sdk');
const s3 = new aws.S3();
const http = require('http');

exports.handler = (event, context, callback) => {
    
    var destHostname = process.env.AUTH_DOMAIN;
    var options = {
      hostname: destHostname,
      port: 80,
      path: '/api/video/upload/name',
      method: 'GET',
      headers: {
           'Content-Type': 'application/json',
           'authorization': event.headers.Authorization
         }
    };

    var req = http.request(options, (res) => {
        if(res.statusCode===200){
            let responseBody = '';
            res.on('data', (chunk) => responseBody += chunk);
            res.on('end', () => {
                getSignedUrl(event, context, callback, {data:JSON.parse(responseBody).data});
            }); 
        }else{
            callback(null, {
                statusCode: '200',
                headers: {'Access-Control-Allow-Origin': '*'},
                body: `Output: ${JSON.stringify(res.statusCode)}, hostname : ${destHostname} , authorization : ${event.headers.Authorization} , environment : ${event.headers.Environment}`
            });    
        }
        
    });

    req.on('error', (e) => {
      callback(null, {
                statusCode: '200',
                headers: {'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify({"error": e})
            });
    });
    req.end();
};

function getSignedUrl(event, context, callback,fileInfo){
    var params = {
        Bucket: process.env.BUCKET, 
        Key: `${fileInfo.data.file_name}`, 
        ContentType: event["queryStringParameters"]['type'],
        Expires: 120
    };
 
    s3.getSignedUrl('putObject', params, function (err, url) {
        if (err) {
            callback(null, {
                statusCode: '200',
                headers: {'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify({"error": err, "eventData":JSON.stringify(event)})
            });
        }
         else {
            callback(null, {
                statusCode: '200',
                headers: {'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify({"url": url,"filename":fileInfo.data.file_name,"fileId":fileInfo.data.file_id,"UploadedContentType":`${event["queryStringParameters"]['type']}`})
            });
        }
     });
}

function removeExtension(filename){
    let lastDotPosition = filename.lastIndexOf(".");
    if (lastDotPosition === -1) return filename;
    else return filename.substr(0, lastDotPosition);
}