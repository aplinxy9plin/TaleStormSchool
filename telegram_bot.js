const Telegraf = require('telegraf')
const { Extra, Markup } = require('telegraf')

const token = '576391027:AAFFAthMU2gyqj6nNYSohKqSnHtN_jVQiPY'

const app = new Telegraf(token)

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
  var reply = ctx.reply
  var replyWithPhoto = ctx.replyWithPhoto
  var chat_id = ctx.from.id
  var message = ctx.update.message.text
  con.query("SELECT status, coins, level FROM users WHERE chat_id = "+chat_id+"", function (err, result, fields) {
    if(result[0] == undefined){
      con.query("INSERT INTO users (chat_id, status) VALUES ("+chat_id+", 'first')", function (err, result) {
        reply('Ждун, приветствую тебя в нашей таверне! С фотографируй своё лицо, чтобы я мог тебя увидеть.');
        replyWithPhoto('https://pp.userapi.com/c834300/v834300379/117bd5/VfleBD_Xqxw.jpg');
        console.log("User recorded to database");
      });
    }else{
      switch (result[0].status) {
        case 'first':
          file_id = ctx.update.message.document.file_id
          getFile(file_id, function(path){
            getEmotion('"https://api.telegram.org/file/bot'+token+'/'+path+'"', function(type, max_value){
              console.log(type);
              console.log(max_value);
              if(type == undefined){
                reply('Если твоё лицо похоже на, это-то я сочувствую тебе. – отправь лицо')
                //replyWithPhoto('1.jpg')
              }else{
                reply('Ты сейчас находишься в таверне искателей приключений, пока ты наш ждун. Тут ты можешь обучаться прокачивая свое звание, проходить квесты за которые ты будешь получать деньги и Сокровища и в таверне есть комната, в которой ты можешь отдохнуть, подготовиться к следующим походам и посмотреть статус персонажа.', Markup
                  .keyboard(['Квест','Обучение','Комната'])
                  .resize()
                  .extra()
                )
                replyWithPhoto('https://sun1-4.userapi.com/c840622/v840622379/76496/UZxU-HkH6nU.jpg');
                updateStatus('menu', chat_id)
              }
            })
          })
          break;
        case 'menu':
          switch (message) {
            case 'Квест':
              reply('Ты встретил крысу! Чтобы победить ее тебе необходимо присвоить переменной c значения сложения переменных a и b.\n\na = 4\nb = 6')
              updateStatus('quest', chat_id)
              break;
            case 'Обучение':
              reply('Давай сформируем твоё тело создав массив тела заново. У тебя должно быть пять элементов в нем. Заполним его левая ногой, правая ногой, левая рука, правая рука, голова. Чтобы тебе это сделать нужно создать массив body = ["одна нога","вторая нога","левая рука","правая рука","голова"]')
              //replyWithPhoto("/img/3.png")
              updateStatus('obu4', chat_id)
              break;
            case 'Комната':
              reply('Приветствую в комнате!\n\nТвой ID: '+result[0].chat_id+'\nТвой баланс: '+result[0].coins+' монет\nТвое звание: '+result[0].level+'')
              replyWithPhoto('https://pp.userapi.com/c831508/v831508379/d538b/VOKWjvO5vZg.jpg')
              break;
            default:
              reply('Ты сейчас находишься в таверне искателей приключений, пока ты наш ждун. Тут ты можешь обучаться прокачивая свое звание, проходить квесты за которые ты будешь получать деньги и Сокровища и в таверне есть комната, в которой ты можешь отдохнуть, подготовиться к следующим походам и посмотреть статус персонажа.', Markup
                .keyboard(['Квест','Обучение','Комната'])
                .resize()
                .extra()
              )
          }
          break;
        case 'obu4':
        // request Request
          send_code(message, function(answer){
            if(answer == 'good'){
              reply('Молодец, все верно! Ты получил 30 монет.', Markup
                .keyboard(['Квест','Обучение','Комната'])
                .resize()
                .extra()
              )
              replyWithPhoto('https://pp.userapi.com/c831508/v831508379/d538b/VOKWjvO5vZg.jpg')
              updateStatus('menu', chat_id)
            }else{
              reply('Неверно, попробуй еще раз!')
            }
          })
          // request to python server
          break;
        case 'quest':
          message = "a=4; b=6; " + message
          send_code(message, function(answer){
            if(answer == 'good'){
              reply('Молодец! Ты победил крысу и получил за это 30 монет и уровень любитель', Markup
                .keyboard(['Квест','Обучение','Комната'])
                .resize()
                .extra()
              )
              replyWithPhoto('https://pp.userapi.com/c831508/v831508379/d538b/VOKWjvO5vZg.jpg')
              updateStatus('menu', chat_id)
            }else{
              reply('Неверно, попробуй еще раз!')
            }
          })
          break;
        default:

      }
    }
  })
})

function send_code(code, callback){
  (function(callback) {
      'use strict';
      const httpTransport = require('http');
      const responseEncoding = 'utf8';
      const httpOptions = {
          hostname: '127.0.0.1',
          port: '3000',
          path: '/?code=print(%27hello%27)',
          method: 'POST',
          headers: {"Content-Type":"application/json; charset=utf-8"}
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
      request.write("{\"code\":\""+code+"\"}")
      request.end();
  })((error, statusCode, headers, body) => {
      callback(body)
  });
}

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
        emotion = []
        console.log('emotion: ', body[0].faceAttributes.emotion);
        emotion[0] = body[0].faceAttributes.emotion.surprise
        emotion[1] = body[0].faceAttributes.emotion.neutral
        emotion[2] = body[0].faceAttributes.emotion.anger
        emotion[3] = body[0].faceAttributes.emotion.contempt
        emotion[4] = body[0].faceAttributes.emotion.disgust
        emotion[5] = body[0].faceAttributes.emotion.fear
        emotion[6] = body[0].faceAttributes.emotion.happiness
        emotion[7] = body[0].faceAttributes.emotion.sadness
        var max_value = Math.max.apply(null, emotion);
        var type;
        for (var i = 0; i < emotion.length; i++) {
          if(emotion[i] == max_value){
            switch (i) {
              case 0:
                type = 'surprise'
                break;
              case 1:
                type = 'neutral'
                break;
              case 2:
                type = 'anger'
                break;
              case 3:
                type = 'contempt'
                break;
              case 4:
                type = 'disgust'
                break;
              case 5:
                type = 'fear'
                break;
              case 6:
                type = 'happiness'
                break;
              case 7:
                type = 'sadness'
                break;
              default:

            }
          }
        }
      }
      callback(type, max_value)
  });
}

function getFile(file_id, callback){
  (function(callback) {
    'use strict';

    const httpTransport = require('https');
    const responseEncoding = 'utf8';
    const httpOptions = {
        hostname: 'api.telegram.org',
        port: '443',
        path: '/bot'+token+'/getFile?file_id='+file_id,
        method: 'GET',
        headers: {"Content-Type":"application/json; charset=utf-8"}
    };
    httpOptions.headers['User-Agent'] = 'node ' + process.version;

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
    request.write("{}")
    request.end();


  })((error, statusCode, headers, body) => {
      //console.log('BODY:', body);
      body = JSON.parse(body);
      path = body.result.file_path;
      callback(path)
  });
}

app.startPolling()
