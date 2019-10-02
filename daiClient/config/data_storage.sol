pragma solidity >=0.4.18 <0.6.0;
pragma experimental ABIEncoderV2;


contract DataStorage{
    
    
    
    struct Data {
        address _from;
        bytes _dataIpfsHash; 
    }
    
    struct Model {
        
        address _from;
        bytes _modelIpfsHash;
        bytes _dataIpfsHash;
    }
    
   struct ModelResult{
       address _from;
       bytes _modelIpfsHash;
   }
   
   
   
    
    Data[] dataHashes;
    
    mapping(address => Model[]) dataProviderRecvModels;
    
    mapping(address => ModelResult[]) modelProviderRecvModelResults;
    
    mapping(bytes => bytes) ipfsHashName;
    
    function storeMetadata(bytes _ipfshash, bytes _name, address _from) public {
       
       Data memory data = Data(_from, _ipfshash);
       
       ipfsHashName[_ipfshash] = _name;
      
       dataHashes.push(data);
      
    }
    
    function getDataArray() public view returns (Data[] _hashes){
        
        return dataHashes;
    }
    
    function getIpfsHashName(bytes _ipfshash) public view returns (bytes _name){
        return ipfsHashName[_ipfshash];
    } 
    
    function getRecvModels(address _from) public view returns (Model[] _models){
        Model[] memory md = dataProviderRecvModels[_from];
        return md;
    }
    
    function getRecvModelResults(address _from) public view returns (ModelResult[] _modelResults){
        ModelResult[] memory mr = modelProviderRecvModelResults[_from];
        return mr;
    }
  
    
    function sendModel(address _to, address _from, bytes _modelIpfsHash, bytes _dataIpfsHash, bytes _name) public  {
       Model memory model = Model(_from, _modelIpfsHash, _dataIpfsHash);
       dataProviderRecvModels[_to].push(model);
       ipfsHashName[_modelIpfsHash] = _name;
    }
    
    function sendModelResult(address _to, address _from, bytes _modelIpfsHash, bytes _name) public {
        ModelResult memory modelResult = ModelResult(_from, _modelIpfsHash);
        modelProviderRecvModelResults[_to].push(modelResult);
        ipfsHashName[_modelIpfsHash] = _name;
    }
    
    
}