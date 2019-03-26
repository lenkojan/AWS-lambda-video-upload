const http = require('http');
exports.handler = (event, context, callback) => {
    let fileName = event.Records[0].s3.object.key;
    console.log(`Filename : ${fileName}`);
    var options = {
      host: process.env.API_DOMAIN,
      path: '/api/public/video/upload/finalize',
      //since we are listening on a custom port, we need to specify it by hand
      port: '80',
      //This is what changes the request to a POST request
      method: 'POST'
    };

    callback = function(response) {
      var str = ''
      response.on('data', function (chunk) {
        str += chunk;
      });
    
      response.on('end', function () {
        console.log(str);
      });
    }

    var req = http.request(options, callback);
    req.write(JSON.stringify({file_name:fileName}));
    req.end();
};