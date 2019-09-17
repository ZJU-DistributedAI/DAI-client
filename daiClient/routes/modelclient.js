var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({dest: 'uploadmodeltmp/'})


function completeRes(msg, code){
    var response = {
        msg: msg,
        code: code,
    };
    return JSON.stringify(response);
}

/* GET home page. */
router.get('/index', function(req, res, next) {
    res.sendFile( __dirname + "/pages/" + "indexmodel.html" );
});
router.get('/walletpage', function(req, res, next) {
    res.sendFile( __dirname + "/pages/" + "modelclientwallet.html" );
});
router.get('/availabledatapage', function(req, res, next) {
    res.sendFile( __dirname + "/pages/" + "model_available_data.html" );
});




// 上传metadata文件至ipfs
router.post('/uploadfile', upload.single('file'), function(req, res) {

    var response = null;
    var data = fs.readFileSync(req.file.path)
    promise = ipfs.files.add(data).then(function(resp){
        console.log(resp);
        response = completeRes(resp[0].hash, 200);
        res.end(response);
    }).catch(function(err){
        response = completeRes("上传至ipfs失败", 500);
        res.end(response);
    });
    // // console.log(result)
    // // response = completeRes(result, 200);
    
});

router.post('/askdata', function (req, res) {
    var response;
    var password = req.body.password;
    var from = req.body.from;
    var metaDataInfo = req.body.metaDataInfo;
    // 参数判断
    if(password === undefined || password === ''||
        metaDataInfo===undefined|| metaDataInfo===''||
        from ===undefined|| from ==='') {
        response = completeRes("参数不完全", 201);
        res.end(response);
    }
    else {
        // 获取nonce
        privateKey = new Buffer(password, 'hex');
        txData = "mpull:" + metaDataInfo;
        web3.eth.getTransactionCount(from).then(function (number) {
            number = number.toString(16);
            // 封装交易
            rawTx = {
                nonce: '0x' + number,
                gasPrice: '0x09184e72a000',
                gasLimit: '0x271000',
                to: ModelTransactionTo,
                value: '0x00',
                data: txData,
            };
            // 离线签名
            tx = new Tx(rawTx);
            tx.sign(privateKey);
            serializedTx = tx.serialize();
            // 发送交易
            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
                .then(function (data) {
                    response = completeRes(data.transactionHash, 200);
                    res.end(response);
                });
        });

    }
});


router.post('/createcontract', function (req, res) {
    var response;
    var password = req.body.password;
    // 参数判断
    if(password === undefined || password === '') {
        response = completeRes("参数不完全", 201);
    }
    else {
        //todo

    }
    res.end(response);
});

router.post('/uploadmodel', function (req, res) {
    var response;

    var password = req.body.password;
    var from = req.body.from;
    var modelIpfsHash = req.body.modelIpfsHash;
    var contractHash = req.body.contractHash;
    // 参数判断
    if(password === undefined || password === ''||
        modelIpfsHash===undefined|| modelIpfsHash===''||
        contractHash===undefined|| contractHash===''||
        from ===undefined|| from ==='') {
        response = completeRes("参数不完全", 201);
        res.end(response);
    }
    else {
        // 获取nonce
        privateKey = new Buffer(password, 'hex');
        txData = "madd:" + modelIpfsHash + ":" + contractHash;
        // 封装交易
        web3.eth.getTransactionCount(from).then(function (number) {
            number = number.toString(16);
            rawTx = {
                nonce: '0x' + number,
                gasPrice: '0x09184e72a000',
                gasLimit: '0x271000',
                to: ModelTransactionTo,
                value: '0x00',
                data: txData,
            };
            // 离线签名
            tx = new Tx(rawTx);
            tx.sign(privateKey);
            serializedTx = tx.serialize();
            // 发送交易
            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
                .then(function (data) {
                    response = completeRes(data.transactionHash, 200);
                    res.end(response);
                });
        });

    }
});

router.post('/uploadresult', function (req, res) {
    var response;
    //todo
    res.end(response);
});


module.exports = router;
