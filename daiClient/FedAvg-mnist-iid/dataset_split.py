import argparse
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
import random
# from PIL import Image
import numpy as np

def dataset_split():
    dataset = datasets.MNIST('../../distillation-based/data', train=True, download=True, transform=transforms.Compose([transforms.ToTensor()]))
    # dataset = datasets.CIFAR10('../../distillation-based/data', download=True, transform=transforms.Compose([transforms.ToTensor(),transforms.Normalize((0.5,0.5,0.5), (0.5,0.5,0.5))]))
    # print(dataset[0][1])
    # print(dataset[0][0].size())
    dataset_1 = []
    dataset_2 = []
    dataset_3 = []
    dataset_4 = []
    dataset_5 = []
    dataset_kl = []

    noise = []
    dataset_kl_temp = []
    worker_num = 5

    dataset_total = []
    for sample in dataset:
        dataset_total.append(sample)
    random.shuffle(dataset_total)
    for sample in dataset_total:
        if len(dataset_1)<10000:
            dataset_1.append(sample)
        elif len(dataset_2)<10000:
            dataset_2.append(sample)
        elif len(dataset_3)<10000:
            dataset_3.append(sample)
        elif len(dataset_4)<10000:
            dataset_4.append(sample)
        elif len(dataset_5)<10000:
            dataset_5.append(sample)
        else:
            dataset_kl.append(sample)

    random.shuffle(dataset_1)
    random.shuffle(dataset_2)
    random.shuffle(dataset_3)
    random.shuffle(dataset_4)
    random.shuffle(dataset_5)
    random.shuffle(dataset_kl)

    return [dataset_1, dataset_2, dataset_3, dataset_4, dataset_5, dataset_kl]

# [dataset_1, dataset_2, dataset_3, dataset_4, dataset_5, dataset_kl] = dataset_split()
# print(len(dataset_1))
# print(len(dataset_2))
# print(len(dataset_3))
# print(len(dataset_4))
# print(len(dataset_5))
# print(len(dataset_kl))