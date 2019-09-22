var express = require('express');
var path = require('path')
var stream  = require('stream')
var multer = require('multer')
var router = express.Router();
var uploaddata = multer({dest: 'uploaddatatmp/'})
var utils = require('./utils.js')
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
router.post('/uploadfile', uploaddata.single('file'), function(req, res) {

    var response = null;
    var data = global.fs.readFileSync(req.file.path)
    
    promise = global.ipfs.files.add(data).then(function(resp){
        console.log(resp);
        response = completeRes(resp[0].hash, 200);
        res.end(response);
    }).catch(function(err){
        console.log(err)
        response = completeRes("上传至ipfs失败", 500);
        res.end(response);
    });
    // // console.log(result)
    // // response = completeRes(result, 200);
    
});

router.get('/downloadfile', function(req, res){

    var file_hash = req.query['file_hash']
    console.log("要下载的模型Hash: "+file_hash)
    var downloadPath = path.resolve(__dirname, "../downloadfiles/");
    global.ipfs.files.get(file_hash, function(err, files){
        var file = files[0];
        // files.forEach(file => {
        //  
        // });  
        console.log(downloadPath) 
        fs.writeFileSync(downloadPath+'\\'+file.path, file.content);
        res.download(downloadPath+'\\'+file.path, function(err){
            if(err){
                console.log(err);
            }
        })
        
        // console.log(files)
        // response = completeRes(resp[0].hash, 200);
        // res.end(response);
    })
    // .catch(function(err){
    //     console.log(err)
    //     response = completeRes("下载文件失败", 500);
    //     res.end(response);
    // });
    
});

router.post('/sendData', function(req, res){
    
    var from = req.body['from'];
    var metaDataIpfsHash = req.body['metaDataIpfsHash'];
    // 参数判断
    if(metaDataIpfsHash===undefined|| metaDataIpfsHash===''||
        from ===undefined|| from ==='') {
        response = completeRes("参数不完全", 201);
        res.end(response);
    }
    var metadataHash = web3.utils.toHex(metaDataIpfsHash);
    var lhash = metadataHash.substring(0, metadataHash.length/2);
    var rhash = "0x"+metadataHash.substring(metadataHash.length/2, metadataHash.length);
    global.web3.eth.personal.unlockAccount(global.adminAddress, global.adminPassword).then(function(){
        console.log("from: "+from);
         global.contract.methods.storeMetadata(lhash, rhash, from).send({from: global.adminAddress, gas:0x271000, gasPrice:0x09184e72a000}).on('receipt', function(confirmationNumber, receipt){
            response = completeRes(confirmationNumber, 200);
            res.send(response);
         })
    });

});


router.post('/sendmodelresult', function(req, res){

    var from = req.body['from'];
    var to = req.body['to'];
    var modelResultHash = req.body['model_hash'];
    if(modelResultHash===undefined|| modelResultHash===''||
        from ===undefined|| from ==='' || to ===undefined|| to ==='') {
        response = completeRes("参数不完全", 201);
        res.end(response);
    }
    var modelResultHashHex = web3.utils.toHex(modelResultHash);
    var lhash = modelResultHashHex.substring(0, modelResultHashHex.length/2);
    var rhash = "0x"+modelResultHashHex.substring(modelResultHashHex.length/2, modelResultHashHex.length);
    global.web3.eth.personal.unlockAccount(global.adminAddress, global.adminPassword).then(function(){
         global.contract.methods.sendModelResult(to, from, lhash, rhash).send({from: global.adminAddress, gas:0x271000, gasPrice:0x09184e72a000}).on('receipt', function(confirmationNumber, receipt){
            response = completeRes(confirmationNumber, 200);
            res.send(response);
         })
    });

})


router.get('/getrecvmodel', function(req, res){

    var from = req.query['from'];
    console.log(from)
    if(from===undefined || from===''){
        response = completeRes("参数不完全", 201);
        res.end(response);
    }
    var total = {}
    global.web3.eth.personal.unlockAccount(global.adminAddress, global.adminPassword).then(function(){
        global.contract.methods.getRecvModels(from).call(null, function(err, result){
            for(var i=0;i<result.length;i++){
                if(total[result[i]._from] === undefined){
                    total[result[i]._from] = [];
                }
                var modelHexHash = produceHashHex(handleHex(result[i].mlhash), handleHex(result[i].mrhash));
                var modelIpfsHash = global.web3.utils.hexToAscii(modelHexHash);
                var dataHexHash = produceHashHex(handleHex(result[i].dlhash), handleHex(result[i].drhash))
                var dataIpfsHash =  global.web3.utils.hexToAscii(dataHexHash)               
                total[result[i]._from].push({'modelIpfsHash: ': modelIpfsHash, 'dataIpfsHash: ': dataIpfsHash});
            }
            console.log(total)
           response = completeRes(total, 200);
           res.send(response);
        })
   });

});


router.post('/addmetadata', function(req, res) {
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
