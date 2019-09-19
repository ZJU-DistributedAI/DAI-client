
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

global.handleHex = handleHex;
global.produceHashHex = produceHashHex;