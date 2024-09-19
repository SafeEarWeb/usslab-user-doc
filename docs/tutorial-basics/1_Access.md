---
sidebar_position: 1
sidebar_label: '连接'
title: '集群基础——连接'
---

## 连接途径

- 校园网内：服务器登录节点`moon`，IP地址为`10.14.101.139`，端口为`31415`
- 校园网外：需要登录到堡垒机，然后再跳到登录节点。IP地址为`124.156.134.117`，端口为`31415`。需要`ssh key`登录，而不是密码。堡垒机为bash受限的Windows SubSystem for Linux。


## 连接方法

目前支持ssh登录和vscode登录。

- Windows：从 Windows 10 版本 1709 开始，微软在 Windows 系统中默认集成了 OpenSSH 客户端。你可以通过命令提示符或 PowerShell 来使用它
- MacOS 自带 SSH 客户端
- 对于vscode，后续将逐步限制，改为从本网站的vscode web server。