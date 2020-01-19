const express = require('express')
const mysql = require('mysql')
const fs = require('fs')
const multer = require('multer');
const bodyParser = require('body-parser')

const app = express()
var expressWs = require('express-ws')(app);
const exphbs = require('express-handlebars');
const port = 3000
const VideoSavePath = ''

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true,
    limit: "1GB",
    parameterLimit: "10000000"
}))

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
    a_resp.render('watch', {
        "videoID": a_req.params.videoID
    })
})

app.use('/videos', express.static('./videos'))

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './videos');
    },
    filename: function(req, file, cb) {
        let splitted = file.originalname.split('.');
        let extension = splitted[splitted.length - 1];
        cb(null, generateName(32) + '.' + extension);
    }
});

function generateName(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

var upload = multer({
    storage: storage
});

// returns accessToken
app.post('/Upload', upload.single('file'), function(a_req, a_resp) {
    let password = a_req.body.password;
    let filename = a_req.file.filename;
    var sqlQuery = `INSERT INTO atlantic (videoId, password) VALUES ( '${filename}', '${password}');`
    con.query(sqlQuery, function(err, result) {})
    a_resp.redirect('/watch/' + filename);
})

// finished
// request host access  
app.post('/RequestWater', function(a_req, a_resp) {
    console.log("Got request for host");
    var videoID = a_req.body.videoID
    var password = a_req.body.password
    //console.log(a_req.);

    var sqlQuery = `SELECT * FROM atlantic WHERE videoId = "${videoID}" AND password = "${password}";`
    con.query(sqlQuery, function(err, result) {
        if (err) throw err;
        if (result.length > 0) {
            var accessToken = Date.now().toString(16);
            console.log(accessToken);
            var sqlQuery = `INSERT INTO pacific (videoId, accessToken) VALUES ( '${videoID}', '${accessToken}');`
            con.query(sqlQuery, function(err, result, fields) {
                if (err) throw err;
                console.log("made query")
                a_resp.json({
                    "token": accessToken
                })
                console.log("fields" + fields);
            })
        } else {
            a_resp.status(403).end()
        }
    })
})

//finished
app.get('/WaterTowerTime', function(a_req, a_resp) {
    var resp = {
        "timeStamp": Date.now()
    }
    console.log(resp);
    a_resp.json(resp)
})

var openSockets = {};

app.ws('/faucet', function(a_ws, a_req) {

  a_ws.on('message', function(msg) {
    console.log(msg)

    if (msg.type == 'start') {
        if (openSockets.hasItem(msg.videoID)) {
            openSockets[msg.videoID].append(a_ws)
        } else {
            openSockets[msg.videoID] = [a_ws]
        }
    } else {
        let output = JSON.stringify({
            "type": msg.type,
            "timeStamp": msg.timeStamp,
            "execute_time": Date.now() + 100

        })
        for (let socket of openSockets[msg.videoID]) {
            socket.send(output)
        }
    }

  })

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))