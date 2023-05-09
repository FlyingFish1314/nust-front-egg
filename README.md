# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

**技术栈：**

`nuxt3 + vue3 + Vue Router + Vite`

## 模板搭建流程

### 项目初始化：

#### 先决条件：

> 如果你已经安装了 node.js，请检查版本大于 16.11，`node ——version`

#### 安装：

在目标目录开启终端执行一下命令知否能够连接主机

```
ping raw.githubusercontent.com
```

如果结果类似于与：

![](https://gitee.com/Flying--fish/chartbed/raw/master/pingNuxt3.png)

表示连接成功，可以使用官方提供的脚手架安装

[中文文档](https://nuxt.com.cn/docs/getting-started/installation)

不出意外的话第一次`ping`可能出现以下错误；

```
Ping 请求找不到主机 ping。请检查该名称，然后重试。
```

表示网络不通，需要手动配置`host`，本地解析域名，配置地址如下：

- Mac 电脑 host 配置路径：`/etc/hosts`
- Win 电脑`host`配置路径：`C:\Windows\System32\drivers\etc\hosts`

编辑`hosts`文件,新增一行：

```
185.l99.108.133 raw.githubusercontent.com
```

_这个`ip`地址从何而来？_

这个用的是一个查询`ip`地址的网站

[IP/服务器 raw.githubusercontent.com 的信息 - 站长工具 (chinaz.com)](https://ip.tool.chinaz.com/raw.githubusercontent.com)

打开网站后会看到类似于以下内容：

![](https://gitee.com/Flying--fish/chartbed/raw/master/20230424214734.png)

为什么是类似，因为这几个 ip 地址会变，具体原因暂时未知，并且有些 ip 直接在本地主机直接`ping [ip]`，的时候会失败，可能是找不到、超时或其他目前还未遇到的问题，挑个能用的把前面 ip 地址的 hosts 文件添加的那行中的 ip 地址给换上，然后**迅速**的保存文件（但是别关，指不定还要用）重新打开终端 ping 以下，如果成功则**赶紧**开始创建项目（过一会指不定 id 地址又换了）：

```
npx nuxi init nuxt3-template
```

如果这次依旧失败了，那么有可能是加速器问题，把加速器关了，检查 host 文件新添加的那行

```
185.l99.108.133 raw.githubusercontent.com
```

还在不在了，不在的话再加上就好，然后保存、开启新终端、ping `IP`地址、创建项目

如果又失败了，那么尝试管理员打开终端全局安装 nuxi 脚手架，命令如下：

```
npm install nuxi -g
```

然后使用全局安装的脚手架创建项目，命令如下：(保险起见开启一个新终端 ping 以下然后再执行)

```
nuxi init nust3-template
```

如果，我是说如果，这次又又失败了，那么不用惊慌，有可能是网络不稳定的原因，多试几次，指不定那次就成功了

或者是使用现成的模板

假定已经初始化成功了，接下来就是愉快的安装运行一把梭了

再 install 的过程中使用`npm install`安装等了半天进度条不带动的，甚至会出现超时的情况，这是时候可以终端，并开始加速了，切换淘宝镜像源，使用 yarn、pnpm 都行。

说了这么多，最快的解决方法还是关闭加速器，然后再使用魔法。
