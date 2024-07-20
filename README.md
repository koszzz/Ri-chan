<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/koszzz/Ri-chan">
    <img src="arts/icon_square.jpg" alt="Logo" width="200">
  </a>

<h3 align="center">小鲤同学</h3>

  <p align="center">
    Liyuu相关娱乐机器人
    <br />
    <a href="https://qun.qq.com/qunpro/robot/share?robot_appid=102054729">腾讯频道机器人</a>
    ·
    <a href="https://bot.q.qq.com/s/2uyyh94qp?id=102054729">QQ 群聊机器人</a>
    ·
    <a href="https://github.com/koszzz/Ri-chan/issues">报告 Bug</a>
    ·
    <a href="https://pd.qq.com/s/5mn3en62d">腾讯频道【Liyuu】</a>
    ·
    <a href="https://afdian.net/a/kyruui">爱发电</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>目录</summary>
  <ol>
    <li>
      <a href="#关于-Ri-chan">关于小鲤同学</a>
        <ul>
            <li>
                <a href="#技术栈">技术栈</a>
            </li>
        </ul>
    </li>
    <li>
      <a href="#快速开始">快速开始</a>
      <ul>
        <li><a href="#前置条件">前置条件</a></li>
        <li><a href="#安装">安装</a></li>
      </ul>
    </li>
    <li><a href="#用法">用法</a></li>
    <li><a href="#规划">规划</a></li>
    <li><a href="#贡献">贡献</a></li>
    <li><a href="#许可证">许可证</a></li>
    <li><a href="#联系">联系</a></li>
    <li><a href="#致谢">致谢</a></li>
  </ol>
</details>

<!-- ABOUT Ri-chan -->

## 关于 Ri-chan

`小鲤同学` 是一款 Liyuu 相关 QQ 机器人，目前功能为“看鲤”、“猜拳”、“点歌”

<p align="right">(<a href="#readme-top">回到顶端</a>)</p>

### 技术栈

**数据库**

-   [MongoDB](https://www.mongodb.com/zh-cn)

**Bot 端**

-   [Node.js](https://nodejs.org/en)
-   [feilongproject/QQNodeSDK](https://github.com/feilongproject/QQNodeSDK)

<p align="right">(<a href="#readme-top">回到顶端</a>)</p>

<!-- GETTING STARTED -->

## 快速开始

### 前置条件

-   npm

### 安装

克隆仓库

```sh
# 克隆仓库
git clone https://github.com/koszzz/Ri-chan.git

# 进入仓库
cd Ri-chan
```

1.  安装依赖
    ```sh
    npm install
    ```
2.  在当前目录中创建 `.env` 文件

    ```sh
    MONGODB={MongoDB 数据库地址}
    BOT_APPID={机器人 App ID}
    BOT_TOKEN={机器人 App Token}
    ```

3.  运行 Bot 端
    ```sh
    node app.js
    ```

<p align="right">(<a href="#readme-top">回到顶端</a>)</p>

<!-- USAGE EXAMPLES -->

## 用法

[添加机器人至腾讯频道](https://qun.qq.com/qunpro/robot/share?robot_appid=102054729)

[添加机器人至 QQ 群聊](https://bot.q.qq.com/s/2uyyh94qp?id=102054729)

请根据提示进行使用

<p align="right">(<a href="#readme-top">回到顶端</a>)</p>

<!-- ROADMAP -->

## 规划

-   [ ] 群聊使用订阅消息实现 1 天 1 条的早安推送

查看 [Open Issues](https://github.com/koszzz/Ri-chan/issues) 获取建议和已知问题的完整列表。

<p align="right">(<a href="#readme-top">回到顶端</a>)</p>

<!-- CONTRIBUTING -->

## 贡献

贡献使开源社区成为学习、启发和创造的绝佳场所。 **非常感谢您所做的一切贡献**。

如果您有更好的建议，请 Fork 该仓库并创建 Pull Request。 您也可以使用 Tag “enhancement” 打开 Issue。

请不要忘记给此项目一个 Star！再次感谢！

1. Fork 项目
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m '加入了一些很棒的功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

<p align="right">(<a href="#readme-top">回到顶端</a>)</p>

<!-- LICENSE -->

## 许可证

以 MIT 协议开源。查看 [`LICENSE`](LICENSE) 以获取更多信息。

<p align="right">(<a href="#readme-top">回到顶端</a>)</p>

<!-- CONTACT -->

## 联系

加入腾讯频道：[【Liyuu】](https://pd.qq.com/s/5mn3en62d)

项目地址: [https://github.com/koszzz/Ri-chan](https://github.com/koszzz/Ri-chan)

在[爱发电](https://afdian.net/a/kyruui)支持我

<a href="https://afdian.net/a/kyruui"><img title="" src="https://pic1.afdiancdn.com/static/img/welcome/button-sponsorme.png" alt="200px 200px" width="100"></a>

<p align="right">(<a href="#readme-top">回到顶端</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## 致谢

-   [飞龙 project](https://github.com/feilongproject)
-   [腾讯频道【Liyuu】](https://pd.qq.com/s/5mn3en62d)
-   [腾讯频道【Liella!】](https://pd.qq.com/s/7nucz4r4z)

<p align="right">(<a href="#readme-top">回到顶端</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/koszzz/Ri-chan.svg?style=for-the-badge
[contributors-url]: https://github.com/koszzz/Ri-chan/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/koszzz/Ri-chan.svg?style=for-the-badge
[forks-url]: https://github.com/koszzz/Ri-chan/network/members
[stars-shield]: https://img.shields.io/github/stars/koszzz/Ri-chan.svg?style=for-the-badge
[stars-url]: https://github.com/koszzz/Ri-chan/stargazers
[issues-shield]: https://img.shields.io/github/issues/koszzz/Ri-chan.svg?style=for-the-badge
[issues-url]: https://github.com/koszzz/Ri-chan/issues
[license-shield]: https://img.shields.io/github/license/koszzz/Ri-chan.svg?style=for-the-badge
[license-url]: https://github.com/koszzz/Ri-chan/blob/master/LICENSE
