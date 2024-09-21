---
sidebar_position: 1
sidebar_label: '操作'
title: '集群基础——基础操作'
---

# 交互式提交Srun

`srun --gres gpu:1 --pty bash`

`srun --gres gpu:1 python main.py`



`srun --gres shard:40` for 40GB GPU



默认分配方式

1GPU 配4个CPU配12GB内存

可以显式通过`srun `

# 批处理提交Sbatch



```bash
#!/bin/bash
#SBATCH -J %1                     # 作业名
#SBATCH -o slurm.out              # 屏幕上的输出文件重定向到 ./slurm.out
#SBATCH --cpus-per-task=4         # 任务使用的 CPU 核心数为 4
#SBATCH --mem=12000								# 内存申请1200GB
#SBATCH -t 3-00:00:00             # 任务运行的默认时间为3天，最长无限
#SBATCH --gres=gpu:1              # 使用 1 块 GPU 卡

# 设置运行环境，可以在命令行设置
# conda activate pytorch

# 输入要执行的命令，例如 ./hello 或 python test.py 等
python main.py
```



# 查看

### 查看队列squeue





### 查看作业情况sacct/scontrol





### 查看节点情况sinfo



# 操作

### 取消作业 scancel



### QOS



