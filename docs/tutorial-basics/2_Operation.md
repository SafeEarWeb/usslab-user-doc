---
sidebar_position: 1
sidebar_label: '操作'
title: '集群基础——基础操作'
---

# 批处理提交sbatch

批处理提交作业，提交后立即返回该命令行终端，用户可进行其它操作。

```bash
#!/bin/bash
#SBATCH -J %1                     # 作业名
#SBATCH -o slurm.out              # 屏幕上的输出文件重定向到 ./slurm.out
#SBATCH --cpus-per-task=4         # 任务使用的 CPU 核心数为 4
#SBATCH --mem=12000								# 内存申请12GB
#SBATCH -t 3-00:00:00             # 任务运行的默认时间为3天，最长无限
#SBATCH --gres=gpu:1              # 使用 1 块 GPU 卡

# 设置运行环境，可以在命令行设置
# conda activate pytorch

# 输入要执行的命令，例如 ./hello 或 python test.py 等
python main.py
```

# 交互式提交Srun

用户在该终端需等待任务结束才能继续其它操作，在作业结束前，如果提交时的命令行终端断开，则任务终止。一般用于短时间小作业测试。

`srun --gres gpu:1 --pty bash`

`srun --gres gpu:1 python main.py`

这里推荐估算自己实验所需要的

`srun --gres shard:40` for 40GB GPU



默认分配方式

1GPU 配4个CPU配12GB内存

可以显式通过`srun `


# 查看

### 查看队列squeue

squeue：显示队列中的作业及作业步状态，含非常多过滤、排序和格式化等选项。



### 查看作业情况sacct/scontrol

sacct：显示激活的或已完成作业或作业步的记账信息。
scontrol：显示或设定Slurm作业、队列、节点等状态。

scontrol show node [node_name]


### 查看节点情况sinfo



# 操作

### 取消作业 scancel

scancel：取消排队或运行中的作业或作业步，还可用于发送任意信号到运行中的作业或作业步中的所有进程。

### QOS



