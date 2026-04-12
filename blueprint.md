这是一份针对您当前 Jekyll 学术网页代码库的深度分析报告。该报告旨在识别当前架构的特征，并为您（或未来的 AI 助手）提供一个清晰、可操作的升级路径。

---

# 📑 代码库状态与升级蓝图

## 1. 核心技术栈与架构概览
*   **Jekyll 主题：** 虽然 `_config.yml` 中声明使用了 `minima`，但实际上属于**深度魔改（High Deviation）**。`_layouts/default.html` 已被完全重写，脱离了 Minima 的原生组件体系，目前更接近于一个“手动挡”的静态站点。
*   **CSS 方案：** 
    *   **原生 CSS：** 核心样式位于 `assets/css/style.css`，采用单文件、非模块化的编写方式。
    *   **第三方图标：** 引入了 **FontAwesome 6.5.2** (CDN 加载)，用于侧边栏的社交图标。
*   **JavaScript 逻辑：**
    *   **核心逻辑：** `js/language.js`。这是一个相对复杂的脚本，负责处理客户端语言偏好（localStorage）、页面跳转以及导航栏链接的动态修补（URL patching）。

## 2. 核心文件映射关系 (File Mapping)
当前项目架构非常扁平，缺乏 Jekyll 推荐的组件化结构：
*   **布局继承关系：**
    *   `_layouts/default.html`：**孤岛式布局**。它不继承任何母版，也不被其他子布局继承。所有页面（`index.md`, `research.md` 等）直接指定 `layout: default`。
*   **组件化程度：**
    *   **缺失 `_includes/`：** 项目目前没有使用 `_includes` 目录。这意味着如“侧边栏 (Sidebar)”、“导航栏 (Navbar)”等组件逻辑是直接硬编码在布局文件或各个 Markdown 文件中的。
*   **数据流向：**
    *   **首页渲染：** 数据流是**静态直出**。`index.md` 并不从 `_data/` 获取信息，而是通过 HTML 标签直接在 Markdown 内部构建了 `.sidebar` 和 `.content` 容器。
    *   **导航流：** 唯一的动态数据流来自 `_config.yml` 中的 `navigation` 数组，通过 Liquid 循环渲染到 `default.html` 的 `<nav>` 中。

## 3. 数据结构解析 (Data Schema)
*   **内容存储：** 典型的“内容即代码”模式。论文展示、项目介绍和个人简介均以 HTML 结构直接打散在各个 `.md` 文件中。
*   **YAML Front Matter 字段：**
    ```yaml
    layout: default # 唯一使用的布局
    title: Home    # 页面标题
    lang: en       # 语言标识（en/cn），由自定义脚本读取
    ```
*   **数据目录：** 目前**无 `_data/` 目录**。所有结构化信息（如联系地址、办公地点、论文摘要）均未抽离，难以进行批量格式化处理。

## 4. 升级痛点与“地雷区”
*   **🚩 地雷：侧边栏硬编码（Sidebar Redundancy）**
    *   **问题：** 侧边栏代码（包含头像、社交链接、地址）在 `index.md`, `research.md`, `education.md` 等多个文件中**完全重复**。
    *   **后果：** 只要修改一个邮箱地址或更换头像，必须手动同步修改 8 个以上文件，极易导致各页面信息不一致。
*   **🚩 地雷：双语逻辑耦合**
    *   **问题：** 语言切换依赖 `language.js` 在页面加载后（Load Event）修改 DOM 链接。
    *   **后果：** 用户在点击导航时可能会看到短暂的链接闪烁，且 SEO 对中文版内容的抓取完全依赖于文件名的手动映射，容错率低。
*   **🚩 样式冲突：** 全局样式直接作用于类名（如 `.container`, `.sidebar`），若引入 Bootstrap 或 Tailwind，会发生严重的样式覆盖冲突。

## 5. 现代化与动画升级建议 (Actionable Insights)

### 🚀 动画切入点
1.  **论文列表渐显 (Staggered Entrance)：** 
    *   **位置：** `research.md` 中的 `hr` 分割线后的各个段落或项目。
    *   **技术：** 推荐使用 **AOS (Animate On Scroll)** 库或 **CSS 交叉观察器 (Intersection Observer)**。
    *   **示例：** `opacity: 0; transform: translateY(20px);` 动画配合延时。
2.  **侧边栏呼吸感：**
    *   **位置：** `.social-icons` 悬停动效。
    *   **技术：** 纯 CSS `transition` + `scale`。
3.  **导航栏指示器：**
    *   **位置：** `.nav-link:after`。
    *   **技术：** 宽度从 0 到 100% 的线性动画，增加交互反馈。

### 🛠️ 功能扩充位 (最佳插入点)
*   **暗黑模式 (Dark Mode)：** 
    *   **位置：** 在 `assets/css/style.css` 头部定义核心颜色变量（Root Variables），并在 `default.html` 的 `nav` 处预留一个图标位。
*   **自动生成 BibTeX：**
    *   **位置：** 将 `research.md` 的内容迁移至 `_data/publications.yml`。
    *   **逻辑：** 在 Liquid 模板中编写 `{% for pub in site.data.publications %}`，循环生成论文列表的同时配套生成隐藏的 BibTeX 弹窗。
*   **阅读进度条：**
    *   **位置：** `default.html` 的 `header` 底部。

---

**💡 下一步 AI 建议：**
优先建立 `_includes/sidebar.html` 并在 `.md` 页面中使用 `{% include sidebar.html %}` 替换硬编码内容。这是实现任何高级动画和架构升级的前提。