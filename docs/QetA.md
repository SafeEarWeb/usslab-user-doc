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