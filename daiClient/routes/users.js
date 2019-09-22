var express = require('express');
var router = express.Router();

function completeRes(msg, code){
  var response = {
      msg: msg,
      code: code,
  };
  return JSON.stringify(response);
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/createwalletpage', function(req, res, next){
  res.sendFile(__dirname + "/pages/" + "createwallet.html")
});


router.post("/createwallet", function(req, res, next){
  var password = req.body['password']
  global.web3.eth.personal.newAccount(password).then(function(address){
    response = completeRes(address, 200)
    res.send(response)
  })
})




module.exports = router;
