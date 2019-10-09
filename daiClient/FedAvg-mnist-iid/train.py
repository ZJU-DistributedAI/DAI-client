import torch
import torch.nn.functional as F
import copy

def train_s(args, worker_num, model_set, device, train_loader_set, optimizer_set, epoch):
    for worker_id in range(worker_num):
        model_set[worker_id].train()
        for batch_idx, (data, target) in enumerate(train_loader_set[worker_id]):
            data, target = data.to(device), target.to(device)
            optimizer_set[worker_id].zero_grad()
            output = model_set[worker_id](data)
            loss_s = F.nll_loss(output, target)
            loss_s.backward()
            torch.nn.utils.clip_grad_norm(model_set[worker_id].parameters(),1)
            optimizer_set[worker_id].step()
            if batch_idx % args.log_interval == 0:
                print('Train Epoch: {} [{}/{} ({:.0f}%)]'.format(epoch, batch_idx * len(data), len(train_loader_set[worker_id].dataset), 100. * batch_idx / len(train_loader_set[worker_id])))
                print('Loss_{}: {:.6f}'.format(worker_id, loss_s.item()))
       # scheduler_set[worker_id].step()

def FedAvg(w):
    w_avg = copy.deepcopy(w[0])
    for k in w_avg.keys():
        for i in range(1, len(w)):
            w_avg[k] += w[i][k]
        w_avg[k] = torch.div(w_avg[k], len(w))
    return w_avg