import torch
import torch.nn as nn
import torch.nn.functional as F

# class Net(nn.Module):
#     def __init__(self):
#         super(Net, self).__init__()
#         layer1 = nn.Sequential() # (b, 3, 32, 32)
#         layer1.add_module('conv11', nn.Conv2d(3, 32, 3, 1, padding=1)) # (b, 32, 32, 32)
#         layer1.add_module('conv12', nn.Conv2d(32, 32, 3, 1, padding=1)) # (b, 32, 32, 32)
#         layer1.add_module('pool1', nn.MaxPool2d(kernel_size=2, stride=2)) # (b, 32, 16, 16)
#         layer1.add_module('dropout1', nn.Dropout(0.25))
#         self.layer1 = layer1
#         layer2 = nn.Sequential()
#         layer2.add_module('conv21', nn.Conv2d(32, 64, 3, 1, padding=1)) # (b, 64, 16, 16)
#         layer2.add_module('conv22', nn.Conv2d(64, 64, 3, 1, padding=1)) # (b, 64, 16, 16)
#         layer2.add_module('pool2', nn.MaxPool2d(kernel_size=2, stride=2)) # (b, 64, 8, 8)
#         layer2.add_module('dropout2', nn.Dropout(0.25))
#         self.layer2 = layer2
#         layer3 = nn.Sequential()
#         layer3.add_module('fc1', nn.Linear(64*8*8, 512)) # (b, 512)
#         layer3.add_module('fc2', nn.Linear(512, 10)) # (b, 10)
#         layer3.add_module('ReLU', nn.ReLU(True))
#         self.layer3 = layer3
#         layer4 = nn.Sequential()
#         layer4.add_module('softmax', nn.Softmax(dim=1))
#         self.layer4 =layer4
  

#     def forward(self, x):
#         x = self.layer1(x)
#         x = self.layer2(x)
#         x = x.view(x.shape[0],-1)
#         x = self.layer3(x)
#         # print(x.size())
#         return F.log_softmax(x, dim=1)

#     def p_for_KL(self, x):
#         x = self.layer1(x)
#         x = self.layer2(x)
#         x = x.view(x.shape[0],-1)
#         x = self.layer3(x)
#         x = self.layer4(x)
#         # print(x.size())
#         return x

class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(1, 20, 5, 1)
        self.conv2 = nn.Conv2d(20, 50, 5, 1)
        self.fc1 = nn.Linear(4*4*50, 500)
        self.fc2 = nn.Linear(500, 10)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        x = F.relu(self.conv1(x))
        x = F.max_pool2d(x, 2, 2)
        x = F.relu(self.conv2(x))
        x = F.max_pool2d(x, 2, 2)
        x = x.view(-1, 4*4*50)
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return F.log_softmax(x, dim=1)

    def p_for_KL(self, x):
        x = F.relu(self.conv1(x))
        x = F.max_pool2d(x, 2, 2)
        x = F.relu(self.conv2(x))
        x = F.max_pool2d(x, 2, 2)
        x = x.view(-1, 4*4*50)
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        x = self.softmax(x)
        return x
