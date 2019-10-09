import torch
import torch.nn.functional as F

def test(args, model_global, device, test_loader):
    model_global.eval()
    test_loss = 0
    correct = 0
    with torch.no_grad():
        for data, target in test_loader:
            data, target = data.to(device), target.to(device)
            output = model_global(data)
            test_loss += F.nll_loss(output, target, reduction='sum').item()
            pred = output.argmax(dim=1, keepdim=True)
            correct += pred.eq(target.view_as(pred)).sum().item()
    test_loss /= len(test_loader.dataset)

    print('\nTest set: ')
    print('Average loss: {:.4f},  Accuracy: {}/{} ({:.0f}%)'.format(test_loss, correct, len(test_loader.dataset), 100. * correct / len(test_loader.dataset)))
    print('\n')
    
    f=open('results_test_FedAvg_mnist_iid.txt','a')
    acc_temp = correct / len(test_loader.dataset)
    f.write(str(acc_temp))
    f.write('\n')
    f.close()
