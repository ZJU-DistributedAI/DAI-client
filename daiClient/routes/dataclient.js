var express = require('express');


var multer = require('multer')
var router = express.Router();
var upload = multer({dest: 'uploaddatatmp/'})

function completeRes(msg, code){
    var response = {
        msg: msg,
        code: code,
    };
    return JSON.stringify(response);
}

/* GET home page. */


router.get('/index', function(req, res, next) {
    res.sendFile( __dirname + "/pages/" + "indexdata.html" );
});

router.get('/walletpage', function(req, res, next) {
    res.sendFile( __dirname + "/pages/" + "dataclientwallet.html" );
});

router.get('/availablecomputingpage', function(req, res, next) {
    res.sendFile( __dirname + "/pages/" + "data_computing_agree.html" );
});

router.get('/modelaskingpage', function(req, res, next) {
    res.sendFile( __dirname + "/pages/" + "data_model_ask.html" );
});


router.get('/modelaskingpage', function(req, res, next) {
    res.sendFile( __dirname + "/pages/" + "data_model_ask.html" );
});

// 上传metadata文件至ipfs
router.post('/uploadfile', upload.single('file'), function(req, res) {

    var response = null;
    var data = global.fs.readFileSync(req.file.path)
    promise = global.ipfs.files.add(data).then(function(resp){
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


router.post('/addmetadata', function (req, res) {
    var response;
    var password = req.body.password;
    var from = req.body.from;
    var metaDataIpfsHash = req.body.metaDataIpfsHash;
    // 参数判断
    if(password === undefined || password === ''||
        metaDataIpfsHash===undefined|| metaDataIpfsHash===''||
        from ===undefined|| from ==='') {
        response = completeRes("参数不完全", 201);
        res.end(response);
    }
    else {
        // 获取nonce
        privateKey = new Buffer(password, 'hex');
        txData = "dadd:" + metaDataIpfsHash;
        var number = web3.eth.getTransactionCount(from).then(function (number) {
            number = number.toString(16);
            // 封装交易
            rawTx = {
                nonce: '0x' + number,
                gasPrice: '0x09184e72a000',
                gasLimit: '0x271000',
                to: "",
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


router.post('/pushdatatocomputing', function (req, res) {
    var response;
    var password = req.body.password;
    var from = req.body.from;
    var dataIpfsHash = req.body.dataIpfsHash;
    var modelAddress = req.body.modelAddress;
    var dataMetadataIpfsHash = req.body.dataMetadataIpfsHash;
    // 参数判断
    if(password === undefined || password === ''||
        dataIpfsHash===undefined|| dataIpfsHash===''||
        modelAddress===undefined|| modelAddress===''||
        dataMetadataIpfsHash===undefined|| dataMetadataIpfsHash===''||
        from ===undefined|| from ==='') {
        response = completeRes("参数不完全", 201);
        res.end(response);
    }
    else {
        // 获取nonce
        privateKey = new Buffer(password, 'hex');
        txData = "dpush:" + dataIpfsHash + ":" + modelAddress + ":" + dataMetadataIpfsHash;
        web3.eth.getTransactionCount(from).then(function (number) {
            number = number.toString(16);
            // 封装交易
            rawTx = {
                nonce: '0x' + number,
                gasPrice: '0x09184e72a000',
                gasLimit: '0x271000',
                to: "",
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


router.post('/aggreemodelclient', function (req, res) {
    var response;
    var password = req.body.password;
    var from = req.body.from;
    var metaDataIpfsHash = req.body.metaDataIpfsHash;
    var modelAddress = req.body.modelAddress;
    // 参数判断
    if(password === undefined || password === ''||
        metaDataIpfsHash===undefined|| metaDataIpfsHash===''||
        modelAddress===undefined|| modelAddress===''||
        from ===undefined|| from ==='') {
        response = completeRes("参数不完全", 201);
        res.end(response);
    }
    else {
        // 获取nonce
        privateKey = new Buffer(password, 'hex');
        txData = "dagree:" + metaDataIpfsHash + ":" + modelAddress;
        web3.eth.getTransactionCount(from).then(function (number) {
            number = number.toString(16);
            // 封装交易
            rawTx = {
                nonce: '0x' + number,
                gasPrice: '0x09184e72a000',
                gasLimit: '0x271000',
                to: "",
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


router.post('/askcomputing', function (req, res) {
    var response;
    var password = req.body.password;
    var from = req.body.from;
    var computingHash = req.body.computingHash;
    var modelAddress = req.body.modelAddress;
    // 参数判断
    if(password === undefined || password === ''||
        computingHash===undefined|| computingHash===''||
        modelAddress===undefined|| modelAddress===''||
        from ===undefined|| from ==='') {
        response = completeRes("参数不完全", 201);
        res.end(response);
    }
    else {
        // 获取nonce
        privateKey = new Buffer(password, 'hex');
        txData = "dcomputing:" + computingHash + ":" + modelAddress;
        web3.eth.getTransactionCount(from).then(function (number) {
            number = number.toString(16);
            // 封装交易
            rawTx = {
                nonce: '0x' + number,
                gasPrice: '0x09184e72a000',
                gasLimit: '0x271000',
                to: "",
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


router.post('/deletedata', function (req, res) {
    var response;
    var password = req.body.password;
    var from = req.body.from;
    var metadataHash = req.body.metaDataIpfsHash;

    // 参数判断
    if(password === undefined || password === ''||
        metadataHash===undefined|| metadataHash===''||
        from ===undefined|| from ==='') {
        response = completeRes("参数不完全", 201);
        res.end(response);
    }
    else {
        // 获取nonce
        privateKey = new Buffer(password, 'hex');
        txData = "ddelete:" + metadataHash;
        web3.eth.getTransactionCount(from).then(function (number) {
            number = number.toString(16);
            // 封装交易
            rawTx = {
                nonce: '0x' + number,
                gasPrice: '0x09184e72a000',
                gasLimit: '0x271000',
                to: "",
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


module.exports = router;
