// request Request
var qwe;
getEmotion('"https://cdnimg.rg.ru/img/content/150/17/72/01-greek-face-reconstruction.adapt.676.1_t_650x433.jpg"', function(){
  console.log(qwe);
})
function getEmotion(url, callback){
  (function(callback) {
      'use strict';

      const httpTransport = require('https');
      const responseEncoding = 'utf8';
      const httpOptions = {
          hostname: 'westcentralus.api.cognitive.microsoft.com',
          port: '443',
          path: '/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise',
          method: 'POST',
          headers: {"Content-Type":"application/json; charset=utf-8", "Ocp-Apim-Subscription-Key": "d01bd1874dee4c16b6d3cf2a832b21a1"}
      };
      httpOptions.headers['User-Agent'] = 'node ' + process.version;

      // Paw Store Cookies option is not supported

      const request = httpTransport.request(httpOptions, (res) => {
          let responseBufs = [];
          let responseStr = '';

          res.on('data', (chunk) => {
              if (Buffer.isBuffer(chunk)) {
                  responseBufs.push(chunk);
              }
              else {
                  responseStr = responseStr + chunk;
              }
          }).on('end', () => {
              responseStr = responseBufs.length > 0 ?
                  Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;

              callback(null, res.statusCode, res.headers, responseStr);
          });

      })
      .setTimeout(0)
      .on('error', (error) => {
          callback(error);
      });
      request.write("{\"url\":"+url+"}")
      request.end();


  })((error, statusCode, headers, body) => {
      if(body[1] == ']'){
        console.log('Пришли лицо!');
      }else{
        body = JSON.parse(body);
        console.log('emotion: ', body[0].faceAttributes.emotion);
        qwe = body[0].faceAttributes.emotion.neutral
      }
      callback()
      //console.log(body[1]);
  });
}
//console.log(qwe);
