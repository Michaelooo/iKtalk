# iKtalk

分为客户端和服务器端两部分。服务器端代码保存在server目录下

## 一些小问题

在 socket 建立连接的时候，经常性的会超过 chrome 的最大并发连接（6个），然后页面就会假死。解决办法就是： chrome://net-internals/#sockets 然后 flush 掉所有重启浏览器。