# 🌊 溪石 - 纯文字内容分享平台

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

<p align="center">
  <b>一个优雅的纯文字内容分享平台，让文字回归本真</b>
</p>

---

## ✨ 特性

### 前台展示
- 📖 **沉浸阅读** - 专注于内容本身的阅读体验
- 🔍 **快速搜索** - 支持标题和内容的模糊搜索
- 🏷️ **智能筛选** - 按全部/热门/最新排序
- � **响应式设计** - 完美适配桌面和移动端

### 后台管理
- 🔐 **密码保护** - 安全的管理后台入口
- 📝 **发布文章** - 轻松创作和发布内容
- ✏️ **编辑管理** - 支持文章的编辑和删除
- � **数据统计** - 查看文章数、浏览量、字数统计
- 💾 **本地存储** - 数据安全保存在浏览器中

## 🎨 设计风格

- **暗黑主题** - 护眼舒适的深色界面
- **毛玻璃效果** - 现代感的 Glassmorphism 设计
- **柔和动画** - 细腻的悬停和过渡效果
- **渐变装饰** - 紫色和青色的优雅渐变

## 🚀 快速开始

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/Wangfugui1799/content-share.git

# 进入项目目录
cd content-share

# 使用任意静态服务器运行，例如：
python3 -m http.server 8080

# 或者使用 Node.js
npx serve
```

然后在浏览器中打开：
- **前台展示**: `http://localhost:8080`
- **后台管理**: `http://localhost:8080/admin.html`

### 管理后台

访问 `/admin.html` 进入管理后台，默认密码为 `xishi2024`

> ⚠️ **安全提示**: 实际部署时请修改 `admin.html` 中的 `ADMIN_PASSWORD` 变量

### 在线访问

🔗 [在线演示](https://content-share.vercel.app) *(部署后更新)*

## 📂 项目结构

```
content-share/
├── index.html        # 前台展示页面
├── admin.html        # 后台管理页面
├── index.css         # 样式文件
├── screenshots/      # 预览截图
│   ├── homepage.png
│   ├── editor.png
│   └── article.png
├── .gitignore        # Git 忽略配置
└── README.md         # 项目说明
```

## 🛠️ 技术栈

- **HTML5** - 语义化结构
- **CSS3** - 现代样式和动画
- **Vanilla JavaScript** - 原生 JS，无框架依赖
- **LocalStorage** - 浏览器本地存储

## 📸 预览

### 前台首页
![首页预览](./screenshots/homepage.png)

### 文章详情
![文章详情预览](./screenshots/article.png)

### 管理后台登录
![管理后台登录](./screenshots/admin_login.png)

### 管理后台仪表盘
![管理后台仪表盘](./screenshots/admin_dashboard.png)

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Wangfugui1799">Wangfugui1799</a>
</p>
