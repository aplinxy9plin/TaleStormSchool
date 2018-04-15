'use strict';

const vk = new (require('vk-io-plus'));

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

vk.setToken('f855542bea5f3adc8819a2a8c868c0e5bca07b2c08e53041c27c9dbc94ba8656d01711e14f8e60d1ca5cd')

vk.on('message',(message) => {
  var vk_id = message.user
  if(message.flags.answered !== undefined){
    console.log('YO BITCH');
  }
  con.query("SELECT status FROM users WHERE vk_id = "+vk_id+"", function (err, result, fields) {
    if(result[0] == undefined){
      con.query("INSERT INTO users (vk_id) VALUES ("+vk_id+")", function (err, result) {
        message.send('Hello, world!');
        vk.longpollClose();
        console.log("User recorded to database");
      });
    }else{
      message.send('Already registered')
      vk.longpollClose();
    }
  })
  console.log(message);
  //console.log('Новое сообщение:',message.text);
});

vk.longpoll()
.then(() => {
    console.log('Longpoll запущен!');
})
.catch((error) => {
    //console.error(error);
});
