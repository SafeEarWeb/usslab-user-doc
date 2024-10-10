---
sidebar_position: 0
sidebar_label: '基础'
title: '集群基础——知识'
---

## TL;DR

- 简介：目前集群由8个服务器组成GPU集群，用Slurm进行任务调度，提高资源利用率；
- 登录：除登录节点moon当前用户没有任务的节点禁止ssh登录；
- 存储：各服务器存储和账户共享，将会设置一定的限额（2TB），可请求增加；
- 操作：申请资源-排队调度-作业运行的方式进行，排队算法目前为先来先服务（FIFO），并限制用户最大作业量和资源量；临近DDL可调QoS
- 问题：右上角到GitHub，搜索是否有相同问题，或提[issues](https://github.com/IssacRunmin/usslab-user-doc/issues)

## 高性能计算（HPC）集群 

- 10个机器组成的集群架构图
- 节点的类型（管理节点、计算节点、存储节点）
- Beegfs 并行文件系统的作用及使用场景
- 什么是高性能计算（HPC）？
- 什么是集群？为什么要使用集群进行计算？
- GPU 与 CPU 的区别以及在 HPC 中的角色

## 作业管理系统（SLURM）简介 
	•	什么是 SLURM 以及如何在集群中管理作业？
	•	常见的 SLURM 作业类型（批处理、交互式、并行）
	（和未组成集群的warrior、fool、magacian服务器）

## 并行文件系统

服务器使用并行文件系统Beegfs，`/mnt/home`所在目录由各个服务器的硬盘组成，所有服务器共享，有1:1镜像（即，一份文件存会镜像存储在两个服务器上，用户不可感知，但这不是备份，删除的数据会永久消失！）。因此代码和数据在各个服务器的这个路径下是一样的。

![beegfs image](https://doc.beegfs.io/latest/_images/mirroring_2.png)



