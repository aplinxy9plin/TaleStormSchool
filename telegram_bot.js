const Telegraf = require('telegraf')
const { Extra, Markup } = require('telegraf')

var $ = require('jQuery');

const app = new Telegraf('576391027:AAFFAthMU2gyqj6nNYSohKqSnHtN_jVQiPY')

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "top4ek",
  password: "q2w3e4r5",
  database: "panda_hack"
});

con.connect(function(err) {
  con.query("SELECT * FROM users", function (err, result, fields) {
    console.log('Connect to database is successful');
  });
});

app.on('message', (ctx) =>{
  //ctx.reply('Hi')
  var reply = ctx.reply
  var chat_id = ctx.from.id
  var message = ctx.update.message.text
  con.query("SELECT status FROM users WHERE chat_id = "+chat_id+"", function (err, result, fields) {
    if(result[0] == undefined){
      con.query("INSERT INTO users (chat_id, status) VALUES ("+chat_id+", 'first')", function (err, result) {
        reply('Hello, world!');
        console.log("User recorded to database");
      });
    }else{
      switch (result[0].status) {
        case 'first':
          reply('Привет, мой дорогой ученик, выбери уровень сложности :)', Markup
            .keyboard(['Новичок','Средний','Профессионал'])
            .resize()
            .extra()
          )
          updateStatus('choose_compl', chat_id)
          break;
        case 'choose_compl':
          switch (message) {
            case 'Новичок':
              // создаем переменную
              replyWithPhoto('Отлично! Это твой персонаж, сейчас он один на площадке. Давай создадим ему друга. Создадим переменную friend. Переменная – это объект, которому дано имя и который может принимать различные значения. Чтобы создать переменную необходимо начать со слова var. Далее название переменной friend и чему она равна\n\nvar friend = "😀";')
              break;
            case 'Средний':

              break;
            case 'Профессионал':

              break;
            default:
              reply('Привет, мой дорогой ученик, выбери уровень сложности :)', Markup
                .keyboard(['Новичок','Средний','Профессионал'])
                .resize()
                .extra()
              )
          }
          break;
        default:

      }
    }
  })
})

function updateStatus(status, chat_id){
  con.query("UPDATE users SET status = '"+status+"' WHERE chat_id = "+chat_id+"")
}

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


app.startPolling()
