---
sidebar_position: 1
sidebar_label: '操作'
title: '基础操作'
---
## 作业提交

### 批处理提交sbatch

批处理提交作业，提交后立即返回该命令行终端，用户可进行其它操作。

```bash
#!/bin/bash
#SBATCH -J my_job                 # 作业名
#SBATCH --cpus-per-task=4         # 任务使用的 CPU 核心数为 4
#SBATCH --mem=20000				  # 默认内存申请为12GB * GPU数量
#SBATCH -t 3-00:00:00             # 任务运行的默认时间为3天，最长14天
#SBATCH --gres=gpu:1              # 使用 1 块 GPU 卡

# 设置运行环境，需要首先load conda
module load conda
conda activate <env_name>

# 输入要执行的命令
python main.py
```

将上面的代码保存为符合格式要求的脚本文件（`#SBATCH`作为bash注释，不会影响bash运行，但SLURM在作业分配时会读取这些配置），然后通过如

```shell
sbatch job.sh
```

来提交代码。

### 交互式提交srun

用户在该终端需等待任务结束才能继续其它操作，在作业结束前，如果提交时的命令行终端断开，则任务终止。一般用于短时间小作业测试。

`srun --gres gpu:1 --pty bash`

`srun --gres gpu:1 python main.py`

这里推荐估算自己实验所需要的

`srun --gres shard:40` for 40GB GPU


默认分配方式

1GPU 配4个CPU配12GB内存


## 作业查看

### 查看队列squeue

squeue：显示队列中的作业及作业步状态，含非常多过滤、排序和格式化等选项。

`squeue` 显示的信息包括以下内容

- `JobID`: 作业编号
- `PARTITION`: 作业在哪个分区上运行
- `NAME`: 作业名称，默认是作业脚本的名字
- `USER`: 作业的所有者
- `ST`: 作业当前状态，详见 Job State Codes，常见的有
  - `CG` 作业正在完成
  - `F` 作业失败
  - `PD` 作业正在等待分配资源
  - `R` 作业正在运行
- `TIME`: 作业已运行时间
- `NODES`: 作业占用的计算节点数
- `NODELIST`: 作业占用的计算节点名
- `(REASON)`: 作业正在等待执行的原因，详见 [Job Reason Codes](https://slurm.schedmd.com/squeue.html#lbAF)，常见的有

  - `AssoGrpCpuLimit`: 账号名下所有小伙伴正在使用的CPU总数达到了账号的CPU数量限额
  - `AssoGrpGRES`: 账号名下所有小伙伴正在使用的GPU总数达到了账号GPU数量限额
  - `Priority`: 作业正在排队等待
  - `QOSMinGRES`: 提交到GPU分区的作业没有申请GPU资源
  - `QOSMaxWallDurationPerJobLimit`: 设置的时间超过了比如`medium` QOS 限制的`--time=14-00:00:00`，14天

### 查看作业情况sacct

sacct：显示激活的或已完成作业或作业步的记账信息。


### 查看节点情况sinfo



## 作业操作

### 取消作业scancel

scancel：取消排队或运行中的作业或作业步，还可用于发送任意信号到运行中的作业或作业步中的所有进程。

如果用户要取消作业，先运行 squeue 命令查询作业编号数字 JobID ，然后运行以下命令取消作业
```bash
scancel <JobID>
```
如果要取消用户的所有作业
```bash
scancel -u ${USER}
```
