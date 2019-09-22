var express = require('express');
var path = require('path')
var router = express.Router();
var multer = require('multer')
var uploadmodel = multer({dest: 'uploadmodeltmp/'})
var utils = require("./utils.js")

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
router.post('/uploadfile', uploadmodel.single('file'), function(req, res) {

    var response = null;
    var data = global.fs.readFileSync(req.file.path)
    console.log(data);
    promise = global.ipfs.files.add(data).then(function(resp){
        console.log(resp);
        response = completeRes(resp[0].hash, 200);
        res.end(response);
    }).catch(function(err){
        response = completeRes("上传至ipfs失败", 500);
        console.log(err);
        res.end(response);
    });
    // // console.log(result)
    // // response = completeRes(result, 200);
     
});




router.get('/getdataarray', function(req, res){

    global.web3.eth.personal.unlockAccount(global.adminAddress, global.adminPassword).then(function(){
        global.contract.methods.getDataArray().call(null, function(err, result){
            total = {}
            for(var i=0;i<result.length;i++){
                if(total[result[i]._from] === undefined){
                    total[result[i]._from] = [];
                }
                var hexHash = produceHashHex(handleHex(result[i].lhash), handleHex(result[i].rhash));
                var metadataHash = global.web3.utils.hexToAscii(hexHash);
                total[result[i]._from].push(metadataHash);
            }
            response = completeRes(total, 200);
            // // res.end(response);
            res.end(response);
           
         })
        
   });

});

router.post('/sendmodel', function(req, res){

    var from = req.body['model_address'];
    var to = req.body['model_data_address'];
    var modelIpfsHash = req.body['model_hash'];
    var dataIpfsHash = req.body['model_data_hash'];

    if(from === undefined || from === ''|| to===undefined|| to===''||
        modelIpfsHash ===undefined|| modelIpfsHash ===''|| dataIpfsHash ===undefined|| dataIpfsHash ==='') {
        response = completeRes("参数不完全", 201);
        res.end(response);
    }
    var modelHashHex = global.web3.utils.toHex(modelIpfsHash);
    var dataHashHex = global.web3.utils.toHex(dataIpfsHash);
    var mlhash = modelHashHex.substring(0, modelHashHex.length/2);
    var mrhash = "0x"+modelHashHex.substring(modelHashHex.length/2, modelHashHex.length);
    var dlhash = dataHashHex.substring(0, dataHashHex.length/2);
    var drhash = "0x"+dataHashHex.substring(dataHashHex.length/2, dataHashHex.length);
    global.web3.eth.personal.unlockAccount(global.adminAddress, global.adminPassword).then(function(){
        global.contract.methods.sendModel(to, from, mlhash, mrhash, dlhash, drhash).send({from: global.adminAddress, gas:0x271000, gasPrice:0x09184e72a000}).on('receipt', function(receipt){
            var response = completeRes(receipt.transactionHash);
            res.end(response);
        })

    });
});


router.get('/getmodelresult', function(req, res){

    var from = req.query['model_result_address']
    global.web3.eth.personal.unlockAccount(global.adminAddress, global.adminPassword).then(function(){
       
        global.contract.methods.getRecvModelResults(from).call(null, function(err, result){

            var total = {};
            if(result.length != 0){  
                for(var i=0; i<result.length; i++){
                    total[result[i]._from] = [];
                    var hexHash = produceHashHex(handleHex(result[i].mlhash), handleHex(result[i].mrhash));
                    var modelResultHash = global.web3.utils.hexToAscii(hexHash); 
                    total[result[i]._from].push(modelResultHash);
                }
            }
            console.log(total);
            response = completeRes(total, 200);
            res.end(response);
            
        })
        
   });

});



router.get('/downloadfile', function(req, res){

    var file_hash = req.query['file_hash']
    console.log("要下载的模型Hash: "+file_hash)
    var downloadPath = path.resolve(__dirname, "../downloadfiles/");
    global.ipfs.files.get(file_hash, function(err, files){
        var file = files[0]; 
        console.log(downloadPath) 
        fs.writeFileSync(downloadPath+'\\'+file.path, file.content);
        res.download(downloadPath+'\\'+file.path, function(err){
            if(err){
                console.log(err);
            }
        })
    })
    
    
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
