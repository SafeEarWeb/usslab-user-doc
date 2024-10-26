---
sidebar_position: 1
sidebar_label: '环境管理'
title: '环境管理'
---

## 环境模块（Module）操作

Environment Modules 提供了一系列命令来管理模块，以下是常用的几个命令：


- module avail：列出当前系统中所有可用的模块。
    ```bash
    module avail
    ```
- module load &lt;模块名&gt;：加载指定的模块，设置相关的环境变量。
    ```bash
    module load conda
    ```
- module unload &lt;模块名&gt;：卸载指定的模块，恢复之前的环境变量。
    ```bash
    module unload conda
    ```
    [bug] 当前版本的unload conda有问题
- module list：显示当前已加载的所有模块。
    ```bash
    module list
    ```
- module search &lt;关键字&gt;：搜索包含关键字的模块。
    ```bash
    module search gcc
    ```

