const express = require('express')
const mysql = require('mysql')
const fs = require('fs')

const app = express()
var expressWs = require('express-ws')(app);
const exphbs = require('express-handlebars');
const port = 3000
const VideoSavePath = '/ '

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

// Homepage
app.get('/', function(a_req, a_resp) {
	a_resp.render('home')
})

// Watch page
app.get('/watch/:videoID', function(a_req, a_resp) {
	a_resp.render('watch', {"videoID": a_req.params.videoID})
})

// returns accessToken
app.post('/Upload', function(a_req, a_resp){
    var sessionPword = a_req.param('password');
    var fileData = a_req.param('file')
    var fileName =  Math.random()+ ".mp4"
    i
    fs.writeFile(filePath + fileName, fileData,  (error) =>
    if(error)
    {
      return;
      throw error;

    })
})


// request host access  
app.post('/RequestWater', function(a_req, a_resp){
  var videoId  = a_req.param('videoID')
  var password = a_req.param('password')

})

app.get('/WaterTowerTime', function(a_req, a_resp){
  var resp = {"timeStamp": Date.now()}
  console.log(resp);
  a_resp.json(resp)
})

//
app.ws('/faucet', function(a_ws, a_req) {
	ws.on('message', function(msg) {

		ws.send(msg);
	});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
