var express = require('express');
var router = express.Router();

function completeRes(msg, code){
    var response = {
        msg: msg,
        code: code,
    };
    return JSON.stringify(response);
}

/* GET home page. */

router.get('/index', function(req, res, next) {
    res.sendFile( __dirname + "/pages/" + "indexcomputer.html" );
});
router.get('/walletpage', function(req, res, next) {
    res.sendFile( __dirname + "/pages/" + "computingclientwallet.html" );
});
router.get('/trainpage', function(req, res, next) {
    res.sendFile( __dirname + "/pages/" + "computing_train.html" );
});

router.get('/dataaskingpage', function(req, res, next) {
    res.sendFile( __dirname + "/pages/" + "computing_data_ask.html" );
});

router.get('/modelaskingpage', function(req, res, next) {
    res.sendFile( __dirname + "/pages/" + "computing_model_ask.html" );
});


router.post('/adddata', function (req, res) {
    var response;
    var password = req.body.password;
    var from = req.body.from;
    var computingIpfsHash = req.body.computingIpfsHash;

    // 参数判断
    if(password === undefined || password === ''||
        computingIpfsHash===undefined|| computingIpfsHash===''||
        from ===undefined|| from ==='') {
        response = completeRes("参数不完全", 201);
        res.end(response);
    }
    else {
        // 获取nonce
        privateKey = new Buffer(password, 'hex');
        txData = "cadd:" + computingIpfsHash;
        web3.eth.getTransactionCount(from).then(function (number) {
            number = number.toString(16);
            // 封装交易
            rawTx = {
                nonce: '0x' + number,
                gasPrice: '0x09184e72a000',
                gasLimit: '0x271000',
                to: ComputingTransactionTo,
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

router.post('/agreerequest', function (req, res) {
    var response;
    var password = req.body.password;
    var from = req.body.from;
    var dataAddress = req.body.dataAddress;
    var modelAddress = req.body.modelAddress;

    // 参数判断
    if(password === undefined || password === ''||
        dataAddress===undefined|| dataAddress===''||
        modelAddress===undefined|| modelAddress===''||
        from ===undefined|| from ==='') {
        response = completeRes("参数不完全", 201);
        res.end(response);
    }
    else {
        // 获取nonce
        privateKey = new Buffer(password, 'hex');
        txData = "cagree:" + dataAddress + ":" + modelAddress;
        web3.eth.getTransactionCount(from).then(function (number) {
            number = number.toString(16);
            // 封装交易
            rawTx = {
                nonce: '0x' + number,
                gasPrice: '0x09184e72a000',
                gasLimit: '0x271000',
                to: ComputingTransactionTo,
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

router.post('/deletedcomputing', function (req, res) {
    var response;
    var password = req.body.password;
    var from = req.body.from;
    var computinghash = req.body.computinghash;

    // 参数判断
    if(password === undefined || password === ''||
        computinghash===undefined|| computinghash===''||
        from ===undefined|| from ==='') {
        response = completeRes("参数不完全", 201);
        res.end(response);
    }
    else {
        // 获取nonce
        privateKey = new Buffer(password, 'hex');
        txData = "cdelete:" + computinghash;
        web3.eth.getTransactionCount(from).then(function (number) {
            number = number.toString(16);
            // 封装交易
            rawTx = {
                nonce: '0x' + number,
                gasPrice: '0x09184e72a000',
                gasLimit: '0x271000',
                to: ComputingTransactionTo,
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

router.post('/uploadencrypteddata', function (req, res) {
    var response;
    //todo
    res.end(response);
});

module.exports = router;
