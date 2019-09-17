var ipfsAPI = require('ipfs-api')
global.yaml = require('yamljs')
global.ipfsConfig = JSON.parse(JSON.stringify(yaml.load('./config/ipfs-config.yaml')), null)
global.ipfs = ipfsAPI(ipfsConfig.config.url, ipfsConfig.config.port, {protocol: ipfsConfig.config.protocol});
global.fs = require('fs')