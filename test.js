var express = require('express')
var app = express()

app.get('/', (req,res) => {
  var x = req.query.code
  console.log('prishel');
  res.send(x)
})

app.listen(3000, function(){
  console.log('server started');
})
