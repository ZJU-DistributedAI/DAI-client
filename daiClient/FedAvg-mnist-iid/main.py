import argparse
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torchvision import datasets, transforms
from model import Net
# from train import train
from train import train_s
from train import FedAvg
from test import test
from dataset_split import dataset_split
import copy
import os

def main():
    # Training settings
    parser = argparse.ArgumentParser(description='PyTorch: Deep Mutual Learning')
    parser.add_argument('--worker-num', type=int, default=5, metavar='N',
                        help='the number of wokers/nodes (default: 5)')
    parser.add_argument('--batch-size', type=int, default=128, metavar='N',
                        help='input batch size for training (default: 128)')
    parser.add_argument('--test-batch-size', type=int, default=1000, metavar='N',
                        help='input batch size for testing (default: 1000)')
    parser.add_argument('--epochs', type=int, default=50000, metavar='N',
                        help='number of epochs to train (default: 50000)')
    parser.add_argument('--lr', type=float, default=0.01, metavar='LR',
                        help='learning rate (default: 0.01)')
    parser.add_argument('--momentum', type=float, default=0.5, metavar='M',
                        help='SGD momentum (default: 0.5)')
    parser.add_argument('--no-cuda', action='store_true', default=False,
                        help='disables CUDA training')
    parser.add_argument('--seed', type=int, default=1, metavar='S',
                        help='random seed (default: 1)')
    parser.add_argument('--log-interval', type=int, default=10, metavar='N',
                        help='how many batches to wait before logging training status')
    parser.add_argument('--save-model', action='store_true', default=True,
                        help='For Saving the current Model')
    args = parser.parse_args()
    use_cuda = not args.no_cuda and torch.cuda.is_available()

    torch.manual_seed(args.seed)

    device = torch.device("cuda" if use_cuda else "cpu")

    kwargs = {'num_workers': 1, 'pin_memory': True} if use_cuda else {}

    [dataset_1, dataset_2, dataset_3, dataset_4, dataset_5, dataset_kl] = dataset_split()
    
    train_loader_1 = torch.utils.data.DataLoader(dataset_1, batch_size=args.batch_size, shuffle=True, **kwargs)
    train_loader_2 = torch.utils.data.DataLoader(dataset_2, batch_size=args.batch_size, shuffle=True, **kwargs)
    train_loader_3 = torch.utils.data.DataLoader(dataset_3, batch_size=args.batch_size, shuffle=True, **kwargs)
    train_loader_4 = torch.utils.data.DataLoader(dataset_4, batch_size=args.batch_size, shuffle=True, **kwargs)
    train_loader_5 = torch.utils.data.DataLoader(dataset_5, batch_size=args.batch_size, shuffle=True, **kwargs)

    train_loader_share = torch.utils.data.DataLoader(dataset_kl, batch_size=args.batch_size, shuffle=True)

    test_loader = torch.utils.data.DataLoader(datasets.MNIST('../../distillation-based/data', train=False, transform=transforms.Compose([transforms.ToTensor()])), batch_size=args.test_batch_size, shuffle=True, **kwargs)

    worker_num = args.worker_num  # the number of workers/nodes

    model_path = os.path.join(os.getcwd(), "modelset")
    print(os.listdir(model_path))
    length = len([_ for _ in os.listdir(model_path)])

    model_set = []
    for _ in range(length):
        model = Net()
        model_set.append(model.to(device))

    optimizer_set = []
    for worker_id in range(worker_num):
        optimizer_set.append(optim.SGD(model_set[worker_id].parameters(), lr=5e-3))

    # optimizer_set_kl = []
    # for worker_id in range(worker_num):
    #     optimizer_set_kl.append(optim.SGD(model_set[worker_id].parameters(), lr=5e-3))
    
   # scheduler_set = []
   # for worker_id in range(worker_num):
       # scheduler_set.append(torch.optim.lr_scheduler.StepLR(optimizer_set[worker_id], step_size=32, gamma=0.9)) #每过32个epoch训练，学习率就乘gamma
     
    model_global = Net().to(device)

    # for epoch in range(1, args.epochs + 1):
    #     w_global_copy = copy.deepcopy(model_global.state_dict())
    #     for worker_id in range(worker_num):
    #         model_set[worker_id].load_state_dict(w_global_copy)
    #     train_s(args, worker_num, model_set, device, [train_loader_1,train_loader_2, train_loader_3, train_loader_4, train_loader_5], optimizer_set, epoch)
    model_file_num = 0
    dict = []
    for i in range(length):
        model_set[i].load_state_dict(torch.load(os.path.join(model_path,'distillation_mnist_iid_{}.pt'.format(i)),map_location='cpu'))
        dict.append(copy.deepcopy(model_set[i].state_dict()))

    w_global = FedAvg(dict)
    model_global.load_state_dict(w_global)
    model_global = model_global.to(device)

    if (args.save_model):
        torch.save(model_global.state_dict(),os.path.join(model_path, "FedAvg_mnist_iid.pt"))




if __name__ == '__main__':
    main()
