const express = require('express')
const mysql = require('mysql')
const fs = require('fs')

var con = mysql.createConnection({
  host: "35.225.82.255",
  user: "root",
  password: "",
  database: 'Ocean'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to DB!");
});

const app = express()
var expressWs = require('express-ws')(app);
const exphbs = require('express-handlebars');
const port = 3000
const VideoSavePath = ''

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

// Homepage
app.get('/', function(a_req, a_resp) {
	a_resp.render('home')
})

// Watch page
// finished \
app.get('/watch/:videoID', function(a_req, a_resp) {
	a_resp.render('watch', {"videoID": a_req.params.videoID})
})

app.use('/videos', express.static('./videos'))

// returns accessToken
app.post('/Upload', function(a_req, a_resp){
  console.log('Inside this upload function ')
    var sessionPword = a_req.params.password;
    var file = a_req.params.file
    var lastPeriod = file.name.split('.')
    var fileType = lastPeriod[lastPeriod.length-1]
    var sqlQuery = `INSERT INTO atlantic (password, fileEXT) VALUES ('${file}', '${sessionPword}');`
    con.query(sqlQuery, function(err, resp) {
      if (err) throw err;
      console.log(resp);;
      console.log('successfully posted to database')
    });
    if(file != null){
      fs.writeFile(fileName, fileData,  (error) =>{
        if (error){
          throw error;
        }
      }
  )
}
})


// request host access  
app.post('/RequestWater', function(a_req, a_resp){
  var videoId  = a_req.params.videoID
  var password = a_req.params.password
  //console.log(a_req.);

  console.log(videoID);
  console.log(password);

  var sqlQuery = `SELECT * FROM atlantic WHERE 'videoId' = ${videoId} & 'password' = ${password};`
  con.query(sqlQuery, function(err, result){
    if (err) throw err;
    console.log(result);
  })




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
