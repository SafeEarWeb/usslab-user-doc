---
sidebar_position: 4
sidebar_label: '常见问题'
title: 'QA'
---

## Q1: 如何登录到节点，我有些历史数据存放在/home目录中

A: 你可以通过在登录节点moon使用srun来登录到特定节点：
```bash
srun --partition=highend -w node29 --pty bash
```
> `--partition`分区，分为`highend`和`normal`，highend是A100和A800那两个服务器，moon和sun；
>
> `-w node29`是意愿分配在某个节点，node29可以通过ping的输出看到，如`ping sun`；
>
> `--pty bash`是申请pty，即申请终端，使用bash交互操作。

注意这时是没有申请GPU的（大概率不会排队）
等新硬盘到了，容量够的话，会把大家原本/home的数据迁移到/mnt/home下（比如说/mnt/home/[user]/sun）；

## Q2: 如何只用一部分显卡？我想多个任务跑在一张显卡上/与他人共享显卡

A: 你可以使用参数如`--gres=shard:90`来申请90GB的显存：

`srun --partition=highend --gres=shard:90 --pty bash`

```bash
ourunmin@moon:~$ srun --partition=highend --gres=shard:90 --pty bash
ourunmin@sun:~$ nvidia-smi
Thu Oct 17 19:47:19 2024
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 550.54.14              Driver Version: 550.54.14      CUDA Version: 12.4     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA A800-SXM4-80GB          Off |   00000000:3E:00.0 Off |                    0 |
| N/A   77C    P0            279W /  400W |   41855MiB /  81920MiB |     95%      Default |
|                                         |                        |             Disabled |
+-----------------------------------------+------------------------+----------------------+
|   1  NVIDIA A800-SXM4-80GB          Off |   00000000:46:00.0 Off |                    0 |
| N/A   28C    P0             42W /  400W |       0MiB /  81920MiB |      0%      Default |
|                                         |                        |             Disabled |
+-----------------------------------------+------------------------+----------------------+

+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI        PID   Type   Process name                              GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|    0   N/A  N/A    758777      C   ...unmingp/envs/def_measure/bin/python      41846MiB |
+-----------------------------------------------------------------------------------------+
```

你可以使用`sinfo -o "%N %G"` (NodeList & GRES) 来查看每个节点的显卡配置（详细配置使用`scontrol show node`查看)：

```bash
sinfo -o "%P %N %G"
PARTITION NODELIST GRES
highend node29 gpu:a800:4,shard:a800:320
normal* node28 gpu:rtx3090:6,shard:rtx3090:144
<snip>
```

解释：

- 高性能区域(highend)节点`node29`，配备了A800显卡4张，可分配显存320GB，即每张显卡80GB显存
- 普通区域(normal)节点`node28`，配备了RTX3090显卡6张，可分配显存144GB，即每张显卡24GB显存
- 可以申请超过一张显卡的显存用量，如上述例子中`--gres=shard:90`申请了90GB，但A800一张卡只有80GB，这样相当于申请了两张显卡，并且和其他人共享一张（`nvidia-smi`中有他人的任务）。针对上述情况，请使用智能分配策略拆分模型，如`transformers`的`device_map="auto"`:
  > transformers.AutoModelForCausalLM.from_pretrained('xxx', device_map="auto")

注意：

1. SLURM分配后，一张显卡状态是独占(`--gres=gpu:1`) 或者共享(`--gres=shard:10`)其一，申请独占显卡即使没有满显存也不会有其他任务加入
2. 当前SLURM版本(24.05)的`shard:XX(GB)`并不真正限制显存占用，请合理估算显存，避免申请和实际使用不符，导致后续任务出错(`RuntimeError: CUDA error: out of memory`)。

