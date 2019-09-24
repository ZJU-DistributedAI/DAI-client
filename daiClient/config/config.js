var path = require("path")
var readline = require('readline');
var ipfsAPI = require('ipfs-api')
global.yaml = require('yamljs')
global.ethereumConfig = JSON.parse(JSON.stringify(yaml.load('./config/ethereum-config.yaml'), null))
global.ipfsConfig = JSON.parse(JSON.stringify(yaml.load('./config/ipfs-config.yaml')), null)
global.ipfs = ipfsAPI(ipfsConfig.config.url, ipfsConfig.config.port, {protocol: ipfsConfig.config.protocol});
global.fs = require('fs')
var Web3 = require('web3')
global.web3 = new Web3(new Web3.providers.HttpProvider(ethereumConfig.config.url))
var abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_modelIpfsHash",
				"type": "bytes"
			},
			{
				"name": "_name",
				"type": "bytes"
			}
		],
		"name": "sendModelResult",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_ipfshash",
				"type": "bytes"
			}
		],
		"name": "getIpfsHashName",
		"outputs": [
			{
				"name": "_name",
				"type": "bytes"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			}
		],
		"name": "getRecvModels",
		"outputs": [
			{
				"components": [
					{
						"name": "_from",
						"type": "address"
					},
					{
						"name": "_modelIpfsHash",
						"type": "bytes"
					},
					{
						"name": "_dataIpfsHash",
						"type": "bytes"
					}
				],
				"name": "_models",
				"type": "tuple[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			}
		],
		"name": "getRecvModelResults",
		"outputs": [
			{
				"components": [
					{
						"name": "_from",
						"type": "address"
					},
					{
						"name": "_modelIpfsHash",
						"type": "bytes"
					}
				],
				"name": "_modelResults",
				"type": "tuple[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getDataArray",
		"outputs": [
			{
				"components": [
					{
						"name": "_from",
						"type": "address"
					},
					{
						"name": "_dataIpfsHash",
						"type": "bytes"
					}
				],
				"name": "_hashes",
				"type": "tuple[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_modelIpfsHash",
				"type": "bytes"
			},
			{
				"name": "_dataIpfsHash",
				"type": "bytes"
			},
			{
				"name": "_name",
				"type": "bytes"
			}
		],
		"name": "sendModel",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_ipfshash",
				"type": "bytes"
			},
			{
				"name": "_name",
				"type": "bytes"
			},
			{
				"name": "_from",
				"type": "address"
			}
		],
		"name": "storeMetadata",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
var contractAddress = "0xee573af7ac3f1739e6427bf4d09c571ae5df8e45"
global.contract = new web3.eth.Contract(abi, contractAddress)
global.adminAddress = "0x660fa64006cd9d478ef864e5b38920ef34987ada"
global.adminPassword = "abc"
global.linebreak = (process.platform === 'win32') ? '\r\n' : '\n'
