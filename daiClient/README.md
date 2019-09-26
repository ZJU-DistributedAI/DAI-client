# 使用方法

## 数据方

> 我们先进入到数据方首页http://127.0.0.1/dataclient/index

**以下所有操作需要在华为VPN连接到内网下进行**


**1. 数据方首先需要创建一个属于自己的钱包地址并且要好好保存下来：**

![3a527e62896bf500da68070fdd9343d5.png](en-resource://database/639:0)
点击Create Wallet 按钮进入创建数据方钱包页面
![3e851653520324b9749eda2a6a26eb8b.png](en-resource://database/637:0)
输入密码创建钱包

**2. 回到首页点击wallet列表下面的Add data 进入数据方的主要操作界面：**

![bc67aea21f6c6692be14ff2543aa1e83.png](en-resource://database/641:0)

**3. 数据方先上传自己的Metadata文件至IPFS并获得对应的IPFS Hash：**

![5e49e31aa0318d85b8c43eed3e5817cf.png](en-resource://database/643:0)


**4. 获得Metadata IPFS Hash之后将该Hash上传至区块链供模型方查看和下载：**

![5c76c233ae23086326daa0a32acb5486.png](en-resource://database/645:0)
要填入数据方自己钱包地址以及Metadata IPFS Hash之后点击上传至区块链


**5. 点击获取收到的模型信息的Submit按钮查看是否有收到模型方发过来的模型：**

> 如果没有收到模型方发过来的模型信息，那么就等待有模型方选定自己的Metadata发送自己的模型过来


![8ee0b5fb9a658380f177639310bc938a.png](en-resource://database/647:0)
我们可以看到模型方的钱包地址，以及该模型方选定的metadata，模型的IPFS Hash信息。

**6. 获取了模型信息以及对应的Metadata信息之后，数据方本地开始模型训练，并将模型训练后的结果传递给模型方：**
  ![9c23d72a9e102d1efcaea204daeb24c1.png](en-resource://database/649:0)
  
先将数据方训练完成的模型数据上传至IPFS

![f901e541ce6db37de2c3c9a6eee2f696.png](en-resource://database/651:0)
然后在填入数据方自己的钱包地址，对应模型方的钱包地址以及对应的模型结果的IPFS Hash，点击提交。







## 模型方

**1. 将模型方的模型信息上传至IPFS Hash：**
![ee01697ab379ba5625acea616ccd8f09.png](en-resource://database/653:0)


**2. 点击列出已存在于区块链当中的数据方Metadata的文件Hash信息的Submit按钮，列出已在区块连上的所有数据方的Hash信息**

![d8012d60d38351597de860e8f93903d0.png](en-resource://database/655:0)


**3. 模型方下载Metadata并选择适合自己的Metadata**
![1589bfd8978d8029f3d454417ae57748.png](en-resource://database/657:0)
![f50d8debf6383e1fa2409bb6323acb03.png](en-resource://database/663:0)


**4. 模型方将自己的模型IPFS Hash和选定的Metadata IPFS Hash一起通过区块链发送给对应的数据方**
![895694cd64d5b84ef9327ae1e39ce272.png](en-resource://database/659:0)
分别填写模型方自己的钱包地址，metedata的IPFS Hash的地址， 对应的数据方钱包地址，模型的IPFS Hash


**5. 当数据方蒸馏训练好模型后，点击获取收到训练好的模型结果Hash信息的Submit按钮获取训练好的模型结果IPFS Hash**
![37e3a3fb8bf88d114065682dc112dcf2.png](en-resource://database/661:0)




**6.模型放下载训练好的模型：**
![e34b403271eb49b0629887496379bd2b.png](en-resource://database/667:0)

