---
sidebar_position: 1
sidebar_label: '远程调试'
title: '远程调试'
---

如果需要调试，可以使用srun+pdb的方法进行。这里也提供vscode的方法，但再次声明，服务器不推荐使用vscode登录到节点，也请不要滥用下述方法。

1. 在登录节点moon提交如下脚本，注意更改端口2222避免冲突（可用端口如1024-65535）：`sbatch debug_server.sh`

```bash
#!/bin/bash
#SBATCH --time=01:00:00
#SBATCH --job-name="code-tunnel"
#SBATCH --signal=B:TERM@60 # tells the controller
                           # to send SIGTERM to the job 60 secs
                           # before its time ends to give it a
                           # chance for better cleanup.

cleanup() {
    echo "Caught signal - removing SLURM env file"
    rm -f ~/.code-tunnel-env.bash
}

# Trap the timeout signal (SIGTERM) and call the cleanup function
trap 'cleanup' SIGTERM

# store SLURM variables to file
env | awk -F= '$1~/^SLURM_/{print "export "$0}' > ~/.code-tunnel-env.bash

/usr/sbin/sshd -D -p 2222 -f /dev/null -h ${HOME}/.ssh/id_rsa &
wait
```

在`~/.bashrc`文件增加下面的指令，加载SLURM相关的环境变量
```bash
# source slurm environment if we're connecting through code-tunnel
[ -f ~/.code-tunnel-env.bash ] && source ~/.code-tunnel-env.bash
```

2. 在本地（不是登录节点）的`~/.ssh/config`（Windows路径一般为`C:\Users\[用户名]\.ssh\config`）添加如下host，注意更改用户名(两个地方，ourunmin)和匹配更改的端口号（2222）。

```text
Host hpc-job
    ProxyCommand ssh ourunmin@moon "nc \$(squeue --me --name=code-tunnel --states=R -h -O NodeList) 2222"
    StrictHostKeyChecking no
    User ourunmin
```

3. 本地vscode就可以登录到调试节点进行调试。注意，提交的任务限时为1小时，过后自动断开。


参考链接：[Cluster workflow feature to allow shell commands or script to run before remote server setup (e.g. slurm) (wrap install script)
](https://github.com/microsoft/vscode-remote-release/issues/1722#issuecomment-1938924435)