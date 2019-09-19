function getAddress(){
    return  "http://127.0.0.1:3000";
}

function getIpfsAddres(){
    // ipfs hash
    return "http://127.0.0.1:3000";
}

function getMonitorServer() {
    // monitor server
    return "http://212.64.85.208:9092";
}

function getTrainServer() {
    // train
    return "http://212.64.85.208:9092";
}

function handleHex(str){
    var res = "";
    if(str[2] == '0'){
        res = str.substring(0,2) + str.substring(3, str.length);
    }else{
        res = str;
    }
    return res;

}

function produceHashHex(str1, str2){

    var res = "";
    
    res = str1 + str2.substring(2, str2.length); 

    return res;
}

