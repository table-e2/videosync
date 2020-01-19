const express = require('express')
var expressWs = require('express-ws')(app);
const app = express()
const port = 3000

app.use(express.static('site'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
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
