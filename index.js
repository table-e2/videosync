const express = require('express')
const app = express()
var expressWs = require('express-ws')(app);
const exphbs = require('express-handlebars');
const port = 3000

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

// Homepage
app.get('/', function(a_req, a_resp) {
	a_resp.render('home')
})

// Watch page
app.get('/watch/\d+', function(a_req, a_resp) {
	console.log(a_req.path)
	a_resp.render('watch', {"videoID": "abcd"})
})

// returns accessToken
app.post('/Upload', func(a_req, a_resp)){
	var sessionPword = a_req.param('password');
    //todo: add file
	
    
	
})
// request host access
app.post('/RequestWater', func(a_req, a_resp){
	var videoId  = a_req.param('videoID')
	var password = a_req.param('password')
	
	
	
})

app.get('/WaterTowerTime', func(a_req, a_resp)){
	constant resp = {"Status":"Success", "Result":{"timeStamp": Date.now()}}
	response.json(resp)
	
})
//
app.ws('/faucet', function(a_ws, a_req) {
	ws.on('message', function(msg) {
		
		ws.send(msg);
	});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))