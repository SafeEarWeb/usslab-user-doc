---
sidebar_position: 1
sidebar_label: '远程调试'
title: '远程调试'
---

如果需要调试，可以使用srun+pdb的方法进行。这里也提供vscode的方法，但再次声明，服务器不推荐使用vscode登录到节点，也请不要滥用下述方法。1和2是一次性的准备，3是每次调试都需要的。

## 1. 本地SSH密钥配置

该方法需要使用ssh public key登录。为安全，请使用非对称密钥。

### 1.1 本地SSH密钥生成

运行`ssh-keygen`，如下面示例：

```shell
# local machine
# 运行ssh-keygen，一般连按几下回车完成ssh密钥生成
<your-name>@<local-machine>:~$ ssh-keygen
enerating public/private rsa key pair.
Enter file in which to save the key (<path-to-home>/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in <path-to-home>/.ssh/id_rsa
Your public key has been saved in <path-to-home>/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:ioN6HjpxF627kkPnIiNVdYZ9JXH6UsE0lA3nPUb8AnA ourunmin@moon
The key's randomart image is:
+---[RSA 3072]----+
|       o  +BE+o. |
|      o + .=+=oo |
|     o o .. ...oo|
|    o .    o  o o|
|   . o  S . .  . |
|. +.+. .   .     |
| =o=o..          |
|=o*.o.           |
|+*.+..           |
+----[SHA256]-----+
```

### 1.2 本地SSH配置

在本地的`~/.ssh/config`（Windows路径一般为`C:\Users\[用户名]\.ssh\config`）添加如下host。如果找不到（隐藏文件夹`.ssh`）可以通过vscode连接ssh时候增加配置找到配置文件。**注意更改两处【用户名】（如`ourunmin`）和更改【端口号】（如`2222`）**：

```text
Host moon
    HostName 10.14.101.139
    Port 31415
    User 【用户名】
Host hpc-job
    ProxyCommand ssh moon "nc \$(squeue --me --name=code-tunnel --states=R -h -O NodeList) 【端口号】"
    StrictHostKeyChecking no
    User 【用户名】
```

避免和其他小伙伴重复（典型端口号1024-65535）。这里的moon是登录节点，hpc-job是调试节点，调试节点根据提交任务时候分配的节点来决定跳转到哪里。

### 1.3 本地SSH公钥上传

将本地密钥的公钥添加到服务器上，运行`ssh-copy-id`，此过程会把本地的公钥（如`id_rsa.pub`）增加到服务器的`moon:~/.ssh/authorized_keys`上。由于目录共享，所有服务器都可以验证本地的密钥进行登录。切记，**不要上传或泄露私钥**。

```shell
# local machine
<your-name>@<local-machine>:~$ ssh-copy-id moon
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "<path-to-your-home>/.ssh/id_rsa.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
ourunmin@moon's password: <your-password>
Number of key(s) added: 1
Now try logging into the machine, with
    "ssh moon"
and check to make sure that only the key(s) you wanted were added.
```

## 2. 服务器密钥配置和脚本配置

### 2.1 服务器密钥配置

服务器也需要一个密钥，用于启动sshd服务，同1.，运行`ssh-keygen`：

```shell
# server moon
<your-name>@moon:~$ ssh-keygen
Generating public/private rsa key pair.
<snip>
```

### 2.2 服务器脚本配置

1. 在登录节点moon保存如下脚本，如叫`debug.sh`。**注意更改端口`PORT=2222`和上面[1.2 本地SSH配置](#12-本地ssh配置)的【端口号】一样**：
    ```bash
    #!/bin/bash
    #SBATCH --time=01:00:00
    #SBATCH --job-name="code-tunnel"
    #SBATCH --signal=B:TERM@60 # tells the controller
                            # to send SIGTERM to the job 60 secs
                            # before its time ends to give it a
                            # chance for better cleanup.

    PORT=2222

    cleanup() {
        echo "Caught signal - removing SLURM env file"
        rm -f ~/.code-tunnel-env.bash
    }

    # Trap the timeout signal (SIGTERM) and call the cleanup function
    trap 'cleanup' SIGTERM

    # store SLURM variables to file
    env | awk -F= '$1~/^SLURM_/{print "export "$0}' > ~/.code-tunnel-env.bash

    # check port occupation
    if [ -n "$(lsof -i:${PORT})" ]; then
        # send error message to stdout and stderr
        # echo "Port ${PORT} is already in use, please change the port number and resubmit the job, remember to change the local ssh configuration file as well" >&2
        echo "端口${PORT}已被占用，请更改端口号，并重新提交任务，注意本地ssh配置文件也要更改" >&2
        exit 1
    fi
    /usr/sbin/sshd -D -p ${PORT} -f /dev/null -h ${HOME}/.ssh/id_rsa &
    wait
    ```

2. 在`~/.bashrc`文件增加下面的指令，加载SLURM相关的环境变量
    ```bash
    # source slurm environment if we're connecting through code-tunnel
    [ -f ~/.code-tunnel-env.bash ] && source ~/.code-tunnel-env.bash
    ```

## 3. 每次调试运行的方法

每次需要调试的时候，就**提交一个任务，申请GPU资源，然后再使用vscode连接到调试节点**。

### 3.1 提交任务

在调试节点上提交任务，如申请一个GPU，则：

```shell
cd <your-workspace>
sbatch --gres=gpu:1 debug.sh
```

### 3.2 vscode连接

本地vscode就可以登录到`hpc-job`这个调试节点进行调试。注意，提交的任务限时为1小时，过后自动断开。


参考链接：[Cluster workflow feature to allow shell commands or script to run before remote server setup (e.g. slurm) (wrap install script)
](https://github.com/microsoft/vscode-remote-release/issues/1722#issuecomment-1938924435)