var express = require('express'), bodyParser = require('body-parser');
var app = express()

app.use(bodyParser.json());

app.post('/', (req,res) => {
  var x = (req.body.code);      // your JSON
  // или так
  var re = new RegExp('‘', 'g');
  x = x.replace(re, '"');
  var re = new RegExp('’', 'g');
  x = x.replace(re, '"');
  console.log(x);
  var z = true
  try{
    eval(x)
  }catch (e){
    z = false
  }finally{
    if(z){
      res.send('good')
    }else{
      res.send('bad')
    }
  }
})

app.listen(3000, function(){
  console.log('server started');
})
