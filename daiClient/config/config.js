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
				"name": "mlhash",
				"type": "bytes"
			},
			{
				"name": "mrhash",
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
						"name": "mlhash",
						"type": "bytes"
					},
					{
						"name": "mrhash",
						"type": "bytes"
					},
					{
						"name": "dlhash",
						"type": "bytes"
					},
					{
						"name": "drhash",
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
						"name": "mlhash",
						"type": "bytes"
					},
					{
						"name": "mrhash",
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
						"name": "lhash",
						"type": "bytes"
					},
					{
						"name": "rhash",
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
				"name": "mlhash",
				"type": "bytes"
			},
			{
				"name": "mrhash",
				"type": "bytes"
			},
			{
				"name": "dlhash",
				"type": "bytes"
			},
			{
				"name": "drhash",
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
				"name": "_lhash",
				"type": "bytes"
			},
			{
				"name": "_rhash",
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
var contractAddress = "0x44d739521a3aaaa69884f06f00d0aa2b86d61110"
global.contract = new web3.eth.Contract(abi, contractAddress)
global.adminAddress = "0x660fa64006cd9d478ef864e5b38920ef34987ada"
global.adminPassword = "abc"