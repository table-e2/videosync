const express = require('express')
const mysql = require('mysql')
const fs = require('fs')
const multer = require('multer');

const app = express()
var expressWs = require('express-ws')(app);
const exphbs = require('express-handlebars');
const port = 3000
const VideoSavePath = ''
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "1GB", parameterLimit: "10000000"}))

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './videos');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

var upload = multer({ storage: storage });

// returns accessToken
app.post('/Upload', upload.single('file'), function(a_req, a_resp){
  let password = a_req.body.password;
  let filename = a_req.file.filename;
  
  a_resp.redirect('/watch/' + filename);
})

// request host access  
app.post('/RequestWater', function(a_req, a_resp){
  console.log(a_req.body)
  var videoID  = a_req.body.videoID
  var password = a_req.body.password
  //console.log(a_req.);

  console.log(videoID);
  console.log(password);

  var sqlQuery = `SELECT * FROM atlantic WHERE videoId = ${videoID} AND password = "${password}";`
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
