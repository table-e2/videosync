const express = require('express')
const mysql = require('mysql')
const fs = require('fs')
const multer = require('multer');
const bodyParser = require('body-parser')
const qrcode = require('qrcode')

const app = express()
var expressWs = require('express-ws')(app);
const exphbs = require('express-handlebars');
const port = 3000
const VideoSavePath = ''

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true,
    limit: "1GB"
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
    qrcode.toDataURL(a_req.hostname + a_req.url, {scale: 8}).then((res) =>
        a_resp.render('watch', {
            "videoID": a_req.params.videoID,
            "qrcode": res
        })
    )
})

app.use('/videos', express.static('./videos'))
app.get('/favicon.ico', function(a_req, a_resp) {
    a_resp.sendFile("favicon.ico", {root: "."})
})

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

var openSockets = {};

app.ws('/faucet', function(a_ws, a_req) {

  a_ws.on('message', function(msg) {
    msg = JSON.parse(msg);
    console.log(msg);

    if (msg.type == 'start') {
        if (msg.videoID in openSockets) {
            console.log("Append", openSockets)
            openSockets[msg.videoID].push(a_ws)
            console.log("Append", openSockets)
        } else {
            console.log("Init", openSockets)
            openSockets[msg.videoID] = [a_ws]
            console.log("Init", openSockets)
        }
    } else {
        let output = JSON.stringify({
            "type": msg.type,
            "timeStamp": msg.timeStamp

        })
        let toDelete = [];
        let theseSockets = openSockets[msg.videoID];
        for (let socket of theseSockets) {
            if (socket === a_ws) {
                console.log("Skipping host")
                continue;
            }
            try {
                socket.send(output);
            } catch (e) {
                toDelete.push(socket);
            }
        }
        for (let socket of toDelete) {
            theseSockets.splice(theseSockets.indexOf(socket), 1);
        }
    }

  })

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))