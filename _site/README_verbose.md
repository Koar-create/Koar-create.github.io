# README_verbose（项目详尽说明文档）

> **阅读提示**：本文档对仓库内可能出现的**个人姓名、邮寄地址、电子邮箱、个人主页类 URL（含学术档案、代码托管、职业社交、ORCID、Google Scholar 等）**均做了**匿名化或占位符处理**，仅用于说明项目结构与实现方式；若需真实信息请以站点发布者本人公开渠道为准。文中凡标注「匿名化摘录」的代码块，**不代表**磁盘上源文件的逐字内容。

---

## Part 1：项目概述

### 1.1 项目定位与总体目标

本仓库从工程形态上看，是一个面向 **GitHub Pages** 部署的 **Jekyll 静态站点** 工程。站点核心用途是承载**个人学术主页**：以双语（英文为主路径、中文为 `_cn` 后缀的并列页面）展示个人简介、教育与研究经历、研究工作与图文材料，并包含一页面向**特定研究生培养项目**的招募与合作说明。与此同时，仓库内还包含若干**与主站相对独立**的静态资源：例如 `cafe/` 目录下以「咖啡俱乐部」为主题的多版本菜单与活动页（自包含 HTML/CSS/少量 JSON），以及 `scratch/` 下用于本地一次性处理的 Python 脚本、`Archived/` 与 `Archive/` 中的历史页面快照或样式实验、`utils/` 中的目录树打印工具等。

从「站点对外表达」的角度概括：项目通过 **Jekyll 的 Markdown 源文件 + Liquid 模板 + 数据文件（YAML）+ 全局样式与脚本** 的组合，把**叙事性文字**、**结构化成果条目**、**插图与矢量流程图**、**可下载 PDF** 组织为可浏览的 HTML；并通过 **JavaScript** 增强交互（语言偏好记忆与导航联动、深色模式、阅读进度、BibTeX 一键复制、滚动显现动画）。

### 1.2 技术栈与运行依赖

- **静态站点生成器**：Jekyll（`Gemfile` 指定 `jekyll ~> 4.4.1`），主题声明为 `minima`（在 `_config.yml` 的 `theme` 字段），但实际页面大量依赖自定义布局 `default` 与自定义样式 `assets/css/style.css`，属于「以 minima 为基底、以自定义布局与样式为主」的混合形态。
- **模板语言**：Liquid（布局 `_layouts/default.html`、包含片段 `_includes/sidebar.html`、各 Markdown 页面中的 `{% include %}`、`{% for %}` 等）。
- **数据驱动内容**：`_data/publications.yml` 以 YAML 列表描述「研究条目」，每条含 `title`、`id`、可选 `bibtex`、以及 `blocks` 数组（块内为 HTML 字符串），供 `research.md` 在英文研究页循环渲染。
- **前端增强**：原生 JavaScript（无打包器），脚本位于 `js/`，由布局统一引入。
- **图标与字体**：布局中通过 CDN 引入 Font Awesome；样式表通过 Google Fonts 引入 Lato 字体族。
- **SEO**：布局 `<head>` 使用 `{% seo %}`（通常由 `jekyll-seo-tag` 等插件在完整工具链中提供；是否启用以本地/CI 的 Gem 组为准）。
- **附属静态页**：`cafe/*.html` 为独立页面，不经过 Jekyll 的 Markdown 转换管线（部署时作为静态文件复制即可）。

### 1.3 站点「实现了什么」——机制层面分条说明

1. **双语并列信息架构**  
   - 英文页：如根路径 `/` 对应 `index.md`，`/research` 对应 `research.md`（Jekyll 的 permalink 规则生成 `.html`），`/education`、`/rbm_recruit` 等同理。  
   - 中文页：通过在各中文 Markdown 前置元数据中设置 `permalink: /xxx_cn.html`（例如 `index_cn.md`、`research_cn.md`），形成与英文页**一一对应**的 URL。  
   - `js/language.js` 使用 `localStorage` 键 `preferredLang` 记录用户偏好；在 `load` 时若发现「当前 URL 语言」与「偏好语言」不一致，则 `replace` 到对应语言版本；点击导航栏语言切换按钮时写入新偏好并整页跳转。  
   - 同脚本在 DOMContentLoaded 与 load 阶段尝试**改写导航链接**（将内部 `.html` 与 `_cn.html` 互转），使顶部导航在中文模式下直接指向中文 permalink。

2. **侧栏个人名片区的组件化复用**  
   - `_includes/sidebar.html` 根据 `page.lang` 切换显示中文或英文姓名标签、邮寄地址文案、工位信息，并统一输出社交图标链接与头像图路径。  
   - 多数 Markdown 页面采用 `{% include sidebar.html %}`；`rbm_recruit.md` 等个别页面在仓库当前状态下**内联复制**了一份侧栏 HTML（与 include 版本语义相近但维护上重复），阅读文档时需注意这一差异。

3. **研究页英文版的「数据驱动 + 交互增强」**  
   - `research.md` 遍历 `site.data.publications`，为每条 publication 渲染标题、可选 BibTeX 复制按钮、以及 `blocks` 中的 HTML。  
   - 每个可折叠展示单元外层使用 `class="reveal-item"`，配合 `js/reveal.js` 的 `IntersectionObserver` 做**滚动进入视口时的阶梯延迟渐显**；若无 Observer API 则直接全部显示。  
   - `features.js` 暴露全局 `copyBibtex(id)`，与按钮 `onclick` 搭配，从隐藏的 `<pre id="...">` 读取 BibTeX 文本并复制到剪贴板，含旧浏览器回退路径与短暂按钮文案反馈。

4. **全局视觉与主题系统**  
   - `assets/css/style.css` 以 CSS 自定义属性定义「设计令牌」，涵盖文本色、品牌色、背景色、边框色、表格样式、阴影等；`[data-theme="dark"]` 下覆写同一套令牌实现深色模式。  
   - `features.js` 在加载时读取 `localStorage` 的 `theme`，为 `document.documentElement` 设置或清除 `data-theme="dark"`，并切换 Font Awesome 月亮/太阳图标。  
   - 顶栏 `position: sticky` 与底部细条进度容器组合，实现**阅读进度条**（随滚动更新 `#myBar` 宽度）。

5. **布局层的统一头部/底部**  
   - `_layouts/default.html` 输出导航：遍历 `_config.yml` 的 `site.navigation` 数组生成链接；右侧放置语言切换与主题切换。  
   - 页脚文本直接来自 `site.footer`。  
   - 主内容区 `{{ content }}` 注入各页的 Markdown 渲染结果（或 HTML 片段）。

6. **配置驱动的导航与资源注册**  
   - `_config.yml` 中 `navigation` 列表定义站点一级导航项；`assets` 列表注册额外样式表路径（与 minima 默认资源并存时需留意优先级与重复引入问题，属维护层面的注意点）。  
   - `title`、`description`、`author` 等字段服务 SEO 与品牌文案。

7. **咖啡主题子站点（实验/展示用途）**  
   - `cafe/menu.html` 及 `menu_v1`…`menu_v4` 等版本体现菜单信息架构与视觉迭代；`about_us.html`、`events.html` 提供品牌叙事与活动信息页。  
   - `cafe/js/beans.json` 以 JSON 数组描述豆子产地、处理法、风味、推荐冲煮与可用性等字段，供菜单脚本读取（具体绑定逻辑以对应 HTML 内嵌脚本为准）。

8. **本地工具与草稿**  
   - `utils/print_directory_tree.py`：递归打印目录树文本，路径在脚本内曾为作者本机绝对路径示例，属于**环境相关**工具。  
   - `scratch/extract_pptx*.py`：依赖 `python-pptx`，从硬编码路径读取 `.pptx` 并打印各页文本，用于本地快速抽取幻灯片文字，不参与站点构建。

### 1.4 站点「展示了什么内容」——业务与叙事层面

1. **首页（中英）**  
   - 个人学术身份简介：就读层次、研究方向兴趣、导师与本科背景的叙述性介绍（中文 `index_cn.md` 采用文言色彩较强的修辞体例，与英文页的平实学术英语形成风格对照）。  
   - 提供联系邮件入口与外链入口（具体地址与 URL 在真实站点中可点击；本文档不复述真实值）。

2. **研究页（中英）**  
   - 英文 `research.md`：顶部概括性研究陈述 + 由 `_data/publications.yml` 渲染的多段结构化内容（含摘要、引言、结果图、阶段二 WRF–OpenFOAM 耦合与城市风场验证等）。  
   - 中文 `research_cn.md`：与英文研究主题平行但**并非**同一套数据驱动机制——中文页将大量内容直接写死在 Markdown 中，并嵌入多张 `/assets/images/` 下图；包含「第一阶段极端降水个例」「第二阶段城市尺度风场降尺度」等章节化叙述。

3. **教育页（中英）**  
   - 时间线式列举学位与工作经历，并提供 Curriculum Vitae PDF 的下载链接（文件名在仓库中为 `Z_Yang_Curriculum_Vitae.pdf`；本文档不对真实姓名做传播性复述）。

4. **RBM 招募页（中英）**  
   - 以段落 + 表格形式描述一个**低空经济 / 无人机物流 / 数字孪生**方向的跨学科项目愿景、工作流程图、可行性报告 PDF 链接、招募角色分工（城市分析、大气与 CFD、AI 与优化、数字孪生与可视化等），并包含项目状态更新说明与合作联络方式指引。

5. **静态资源目录 `assets/`**  
   - `assets/images/`：研究示意图、流程 SVG、肖像与若干照片类素材（`.gitignore` 中忽略 `*.jpg`/`*.png` 规则与仓库实际是否跟踪二进制有关，部署环境需自行保证资源存在）。  
   - `assets/documents/`：PDF 与 docx 类文档（可行性报告、履历、项目表格等）。

6. **归档与历史**  
   - `Archived/`：保存早期「学术主页」HTML 快照及其 `_files` 资源，便于对照历史样式。  
   - `Archive/`：更轻量的索引版本 HTML 与旧 CSS。

### 1.5 项目树状结构（说明性总览）

下列树状结构基于仓库一次递归列举整理，**省略**了 `.jekyll-cache` 内部大量哈希缓存文件（它们对理解业务无贡献且体积噪声大）。`_site/` 为 Jekyll 构建输出目录，通常不应手工编辑；其中文件镜像了源站点的生成结果。路径中若含历史网页保存时的浏览器标题长文件名，已在显示时做**标题级匿名化**处理。

```
[仓库根]/
├── .gitignore
├── AUTO-CHECKPOINT.md          # 任务过程检查点（本会话新增）
├── README_verbose.md           # 本详尽说明文档
├── Gemfile
├── Gemfile.lock
├── _config.yml
├── index.md
├── index_cn.md
├── research.md
├── research_cn.md
├── education.md
├── education_cn.md
├── rbm_recruit.md
├── rbm_recruit_cn.md
├── current_directory_tree.txt  # 简易占位/记录文件（当前内容极简）
│
├── _data/
│   └── publications.yml        # 英文研究页数据驱动源
├── _includes/
│   └── sidebar.html            # 侧栏名片 Liquid 片段
├── _layouts/
│   └── default.html            # 全站主布局
│
├── assets/
│   ├── css/
│   │   └── style.css           # 全站主样式（含暗色令牌、表格、reveal 动画样式）
│   ├── documents/              # PDF / docx 等（具体文件名见磁盘）
│   └── images/                 # 插图、肖像、流程图等
│
├── js/
│   ├── language.js             # 双语偏好与导航链接改写
│   ├── reveal.js               # 滚动显现动画（IntersectionObserver）
│   └── features.js             # 暗色模式、阅读进度、BibTeX 复制
│
├── cafe/                       # 与主站弱耦合的咖啡主题静态页
│   ├── about_us.html
│   ├── events.html
│   ├── menu.html
│   ├── menu_v1.html … menu_v4.html
│   └── js/
│       └── beans.json          # 豆子信息数据源
│
├── utils/
│   └── print_directory_tree.py # 本地打印目录树工具脚本
├── scratch/
│   ├── extract_pptx.py
│   └── extract_pptx_fixed.py   # 从本机路径读取 pptx 文本（UTF-8 输出修正版）
│
├── Archive/
│   ├── index.v0.html
│   ├── index.v1.html
│   └── style_0921.css
├── Archived/
│   ├── Home _ [历史快照标题已匿名] Academic Homepage.html
│   └── Home _ [历史快照标题已匿名] Academic Homepage_files/
│       ├── all.min.css
│       └── style.css
│
├── .jekyll-cache/              # Jekyll 本地缓存（树内细节省略）
└── _site/                      # 构建输出（镜像生成站点，勿手改）
    ├── index.html
    ├── index_cn.html
    ├── research.html / research_cn.html
    ├── education.html / education_cn.html
    ├── rbm_recruit.html / rbm_recruit_cn.html
    ├── assets/ …
    ├── js/ …
    ├── cafe/ …
    └── feed.xml                  # RSS/Atom 类输出（取决于插件与配置）
```

### 1.6 页面与源文件对应关系（速查表）

| 用户可见路径（示例） | 主要源文件 | 语言 | 备注 |
|----------------------|------------|------|------|
| `/` 或 `/index.html` | `index.md` | en | 使用 `sidebar` include |
| `/index_cn.html` | `index_cn.md` | cn | 侧栏内联于本文件，与 include 版并行存在 |
| `/research` → `.html` | `research.md` | en | 数据驱动 + reveal + BibTeX |
| `/research_cn.html` | `research_cn.md` | cn | 长文 + 多图，静态写在 Markdown |
| `/education` | `education.md` | en | PDF 链接 |
| `/education_cn.html` | `education_cn.md` | cn | 同上 |
| `/rbm_recruit` | `rbm_recruit.md` | en | 侧栏内联复制 |
| `/rbm_recruit_cn.html` | `rbm_recruit_cn.md` | cn | front matter 中 `lang: en` 与中文内容并存，属可维护性注意点 |
| `/cafe/*.html` | `cafe/*.html` | 以页面为准 | 不经由 Markdown 前置元数据 |

### 1.7 构建、预览与部署要点（概念性）

在本地安装 Ruby 与 Bundler 的前提下，常规工作流为：`bundle install` 安装 Gem 依赖；`bundle exec jekyll serve` 启动带自动重建的预览服务器；推送至 GitHub 后由 Pages 执行构建（具体 Ruby 版本与插件白名单以平台文档为准）。`.gitignore` 当前包含 `index.html`、`Archive/`、`_site/`、`*.jpg`、`*.png` 等条目，意味着**部分二进制资源可能未被纳入版本控制**；新克隆仓库者若发现图片缺失，需要对照 `.gitignore` 与发布流程判断是否改用 LFS、取消忽略或从发布分支单独获取资源。

### 1.8 可访问性与交互设计上的自洽性说明

- 语言切换依赖整页跳转与 `localStorage`，对禁用存储的用户会退回默认行为（脚本默认 `preferredLang` 为 `en`）。  
- 深色模式使用根元素 `data-theme`，对自定义组件颜色依赖 CSS 变量覆写，扩展新组件时应复用变量而非写死色值。  
- `reveal.js` 在元素进入视口后 `unobserve`，避免重复动画；阈值与 rootMargin 为经验参数，可按内容密度微调。  
- `copyBibtex` 使用全局 `event`（内联 `onclick` 浏览器隐式行为），在现代模块化打包实践中不推荐，但在本静态小脚本场景可工作；若未来改为 `addEventListener` 传参，应显式传入按钮引用。

---

## Part 2：重要文件详解（含代码块）

以下各小节结构为：**文件路径 → 职责摘要 → 与周边模块关系 → 关键实现说明 → 代码摘录**。除明确标注为「磁盘原文无隐私字段可引述」外，凡含邮箱、个人 URL、姓名、详细地址的摘录均采用**匿名化后的等价示意**。

### 2.1 `_config.yml` —— 站点级元数据与导航配置

**职责**：声明站点标题、作者文案、主题、导航条目、额外样式表列表、页脚字符串、以及搜索引擎验证用 meta 片段占位等。

**关系**：被 Jekyll 编译为 `site` 对象；`_layouts/default.html` 消费 `site.navigation`、`site.footer`、`site.title`；`{% seo %}` 读取 SEO 相关字段。

**说明**：其中 `google_site_verification` 为站点验证串，**不属于**个人姓名/邮箱，但属于站点指纹类信息；在匿名化文档中如需公开分享可酌情打码。下面摘录对验证串做占位处理。

```yaml
title: "[ANON] Academic Homepage"
description: "[ANON] personal website — research focus overview."
author: "[ANON_DISPLAY_NAME]"
theme: minima

google_site_verification: "[REDACTED_VERIFICATION_TOKEN]"

navigation:
  - title: Home
    url: /
  - title: Research
    url: /research
  - title: Education
    url: /education
  - title: RBM recruit
    url: /rbm_recruit

assets:
  - /assets/css/style.css

webmaster_verifications:

footer: "© [YEAR] [ANON_DISPLAY_NAME] | All rights reserved."
```

**功能逐字段解释**：

- `title` / `description` / `author`：构成站点品牌与 SEO 摘要文本来源。  
- `theme: minima`：启用 minima 主题资源与约定；本项目仍自定义 `_layouts/default.html`，实际视觉以自定义布局与 `assets/css/style.css` 为主。  
- `navigation`：驱动顶栏导航顺序与目标路径；与 `language.js` 的「根据语言改写 `.html` / `_cn.html`」逻辑共同决定用户点击导航时的落点。  
- `assets`：声明附加 CSS；需与布局中显式 `<link href="/assets/css/style.css">` 并存关系心里有数，避免重复或覆盖顺序不符合预期。  
- `footer`：全站统一页脚文本。

---

### 2.2 `_layouts/default.html` —— 统一 HTML 骨架与脚本挂载点

**职责**：输出 `<html>` 文档结构、引入样式与 SEO 标签、构建顶栏导航与阅读进度条、注入页面正文、在底部挂载三个核心脚本。

**关系**：所有使用 `layout: default` 的 Markdown 页共享此骨架；脚本全局作用于任意页面。

**磁盘原文可引述**（该文件不含个人邮箱，仅含公共资源 URL 与站点变量）：

```1:42:d:\Documents\Koar-create.github.io\_layouts\default.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{ page.title }} | {{ site.title }}</title>
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  {% seo %}
</head>
<body>
  <header>
    <nav>
      {% for item in site.navigation %}
        <a href="{{ item.url | relative_url }}" class="nav-link">{{ item.title }}</a>
      {% endfor %}
      
      <div class="nav-right">
        <!-- Language toggle -->
        <a href="javascript:void(0);" id="lang-toggle" class="toggle-btn" title="Toggle Language">
          {% if page.url contains '_cn' %}EN{% else %}中{% endif %}
        </a>
        <!-- Dark mode toggle -->
        <a href="javascript:void(0);" id="theme-toggle" class="toggle-btn" title="Toggle Dark Mode">
          <i class="fas fa-moon"></i>
        </a>
      </div>
    </nav>
    <!-- Reading Progress Bar -->
    <div class="progress-container">
      <div class="progress-bar" id="myBar"></div>
    </div>
  </header>
  <main>
    {{ content }}
  </main>
  <footer>
    {{ site.footer }}
  </footer>
  <script src="{{ site.baseurl }}/js/language.js"></script>
  <script src="{{ site.baseurl }}/js/reveal.js"></script>
  <script src="{{ site.baseurl }}/js/features.js"></script>
</body>
</html>
```

**功能说明**：

- `page.title | site.title` 浏览器标题拼接，有利于多标签页识别。  
- Font Awesome 提供侧栏与主题按钮图标基线。  
- `lang-toggle` 初始显示逻辑：若当前 URL 含 `_cn` 则显示「EN」，否则显示「中」，提示用户点击后将切换到哪一种语言界面。  
- `progress-container` 绝对定位于 header 底边，配合 `features.js` 更新宽度形成阅读进度。  
- 三枚脚本顺序：`language.js`（偏好与导航）→ `reveal.js`（动画）→ `features.js`（主题、进度、复制）；若未来有依赖关系变化，应注意 `DOMContentLoaded` 与 `load` 监听器的执行次序。

---

### 2.3 `_includes/sidebar.html` —— 侧栏名片区（匿名化摘录）

**职责**：头像、姓名（随 `page.lang` 切换）、社交链接组、邮寄地址与工位信息。

**关系**：被 `index.md`、`research.md`、`education.md` 等引用；与 `index_cn.md` 内联侧栏存在**双轨维护**风险。

**匿名化摘录**（结构等价于仓库文件，敏感常量已替换）：

```liquid
<div class="sidebar">
  <img src="/assets/images/Portrait.jpg" alt="Portrait">
  {% if page.lang == 'cn' %}
    <p class="name">[中文姓名已隐去]</p>
  {% else %}
    <p class="name">[英文显示名已隐去]</p>
  {% endif %}
  <div class="social-icons">
    <a href="mailto:[ANON_EMAIL]" title="Email (Academic)">
      <i class="fas fa-envelope"></i>
    </a>
    <a href="https://www.linkedin.com/in/[ANON_LINKEDIN_SLUG]/" title="LinkedIn" target="_blank">
      <i class="fab fa-linkedin"></i>
    </a>
    <a href="https://github.com/[ANON_GH_USER]/" title="Github" target="_blank">
      <i class="fab fa-github"></i>
    </a>
    <a href="https://orcid.org/[ANON_ORCID]" title="ORCID" target="_blank">
      <i class="fab fa-orcid"></i>
    </a>
  </div>
  {% if page.lang == 'cn' %}
    <p><strong>邮寄地址：</strong>
    <br>[中文地址已泛化为：某省某市某区某路（邮编已隐去）]</p>
    <p><strong>我的工位：</strong>[楼宇/房间号已隐去]</p>
  {% else %}
    <p><strong>Mailing Address:</strong>
    <br>[英文地址已泛化为：某国某城市某区街道（邮编已隐去）]</p>
    <p><strong>My workplace:</strong>[楼宇/房间号已隐去]</p>
  {% endif %}
</div>
```

**功能说明**：

- `page.lang` 由各自 Markdown 前置元数据 `lang: en` 或 `lang: cn` 提供，是侧栏语言切换的单一事实来源（与 URL 是否含 `_cn` 在理想状态下应一致）。  
- `word-break: break-all` 在样式表中对侧栏段落生效，避免长 URL 撑破布局。  
- 社交图标使用语义化 `<i>` 与 Font Awesome 类名组合。

---

### 2.4 `index.md` —— 英文首页正文容器

**职责**：在 `layout: default` 内组合 `sidebar` 与主内容，撰写学术自我介绍段落与外部项目链接、导师与本科背景描述、邮件联系入口。

**关系**：与 `index_cn.md` 平行；导航默认指向 `/`。

**匿名化摘录**（保留 HTML 结构与段落逻辑）：

```markdown
---
layout: default
title: Home
lang: en
---

<div class="container">
  {% include sidebar.html %}
  <div class="content">
    <div>
      <h1>Bio</h1>
      <p>
        I am a graduate student at [ANON_INSTITUTION_CAMPUS].
        See <a href="https://example.edu/program/red-bird-mphil/">this program page (URL anonymized)</a> for details.
        Research interests include atmospheric modeling, CFD, and aerospace/UAS-related applications.
        <br><br>My supervisor is
        <a href="https://scholar.google.com/citations?user=[ANON_SCHOLAR_ID]">Dr. [Supervisor Name Redacted]</a>.
        Undergraduate training at [ANON_UNDERGRAD_UNIVERSITY], thesis advised by Dr. [Name Redacted].
      </p>
      <hr>
      <p>
        <br>Contact: <a href="mailto:[ANON_EMAIL]?Subject=Hello">email (anonymized)</a>.
      </p>
    </div>
  </div>
</div>
```

**功能说明**：首页采用「侧栏 + 内容」栅格（由 `assets/css/style.css` 的 `.container` flex 布局实现），`Bio` 标题下为自述；`mailto` 主题参数预置 `Subject=Hello` 降低邮件客户端填写成本。

---

### 2.5 `index_cn.md` —— 中文首页（侧栏内联版）

**职责**：中文文言风格自述；侧栏 HTML **直接写在本文件**而非 include。

**关系**：`permalink: /index_cn.html`；`language.js` 将首页中文路径特判为 `/index_cn.html`。

**维护提示**：任何侧栏链接或头像变更需同步 `_includes/sidebar.html`、`index_cn.md`、以及 `rbm_recruit*.md` 内联侧栏，否则会出现不一致。

---

### 2.6 `research.md` —— 英文研究页（数据驱动渲染）

**职责**：顶部概括段落 + 循环 `site.data.publications` 输出多段 `reveal-item` HTML + BibTeX 按钮与隐藏 `<pre>`。

**关系**：强依赖 `_data/publications.yml`；弱依赖 `assets/images/` 下图示文件路径在 YAML HTML 字符串中写死。

**磁盘原文可引述**（文件本身无隐私字段）：

```1:40:d:\Documents\Koar-create.github.io\research.md
---
layout: default
title: Research
lang: en
---

<div class="container">
  {% include sidebar.html %}
  <div class="content">
    <h1>Research</h1>
    <p>
      My current work focuses on the numerical model WRF's reproducibility and performance during a record-breaking precipitation event happened during September 7 to 8 in 2023 at the Greater Bay Area (GBA). Over 270 experiments have been conducted, and most experiments underestimate the peak precipitation. Evaluation are based on station records offered by the China's Meteorological Administration during the event.
    </p>
    <hr>

    {% for pub in site.data.publications %}
    <div class="reveal-item">
      <h2 style="display: flex; justify-content: space-between; align-items: center;">
        <span>{{ pub.title }}</span>
        {% if pub.bibtex %}
          <button class="bibtex-btn" onclick="copyBibtex('{{ pub.id }}')" style="font-size: 14px; padding: 4px 10px; cursor: pointer; border: 1px solid var(--color-border); background: var(--color-bg-page); color: var(--color-text-muted); border-radius: 4px; transition: all 0.2s;">Copy BibTeX</button>
        {% endif %}
      </h2>
      {% if pub.bibtex %}
        <!-- Hidden BibTeX data for copy function -->
        <pre id="{{ pub.id }}" style="display: none;">{{ pub.bibtex }}</pre>
      {% endif %}
      {{ pub.blocks[0].html }}
    </div>
    {% for block in pub.blocks offset: 1 %}
    <hr>
    <div class="reveal-item">
      {{ block.html }}
    </div>
    {% endfor %}
    {% unless forloop.last %}<hr>{% endunless %}
    {% endfor %}

  </div>
</div>
```

**功能说明**：

- `pub.blocks[0].html` 与后续 `offset:1` 拆分，使第一块与后续块各自包在独立 `reveal-item` 中，滚动动画粒度更细。  
- `copyBibtex('{{ pub.id }}')` 与 `_data/publications.yml` 中 `id` 字段一一对应。  
- `unless forloop.last` 控制分隔线，避免末尾多余 `<hr>`。

---

### 2.7 `_data/publications.yml` —— 出版物与阶段成果数据源（匿名化 BibTeX 摘录）

**职责**：以 YAML 表达多篇「工作论文/在准备中稿件」的标题、BibTeX、以及富 HTML 块；HTML 内嵌 `<img>` 指向固定资源路径。

**关系**：仅被 `research.md` 使用（中文研究页未使用此机制）。

**匿名化摘录**（展示结构；作者姓名为占位符）：

```yaml
- title: "A Case Study on the Record-Breaking Rainfall in Southern China during September 7-8, 2023"
  id: "case_study_2023"
  bibtex: |
    @article{anon2025case,
      title={A Case Study on the Record-Breaking Rainfall in Southern China during September 7-8, 2023},
      author={[Author Redacted] and [Author Redacted]},
      journal={In Preparation},
      year={2025}
    }
  blocks:
    - html: |
        <p><strong>Abstract</strong> … WRF … cumulus parameterization …</p>
        <p><strong>Introduction</strong> … Typhoon event context …</p>
        <img src="/assets/images/background.png" alt="Research Image 1" style="max-width:800px; height:auto;">
    - html: |
        <p><strong>Results</strong> … bullet list … figures …</p>
    # … 后续 blocks 省略，磁盘上完整保留 …

- title: "Phase 2: WRF-OpenFOAM Coupling for Urban Wind Field Downscaling"
  id: "phase2_coupling_2025"
  bibtex: |
    @article{anon2026phase2,
      title={WRF-OpenFOAM Coupling for Urban Wind Field Downscaling},
      author={[Author Redacted] and [Author Redacted]},
      journal={Working Paper},
      year={2026}
    }
  blocks:
    - html: |
        <p>… mesoscale to urban CFD … LiDAR validation … Taylor diagram …</p>
    - html: |
        <p><strong>Future Directions</strong> … split-roughness boundary … LES/WMLES …</p>
```

**功能说明**：把「长文研究页」从 Markdown 中解放出来，转为**数据 + 模板**，利于复用按钮、统一动画类名、以及后续接入自动化生成 BibTeX 的流程；代价是 YAML 内嵌 HTML 的可读性与 diff 噪声较高，编辑时需严格注意缩进与引号转义。

---

### 2.8 `research_cn.md` —— 中文研究长文

**职责**：以中文（含文言修辞）叙述同一研究主线第二阶段内容，嵌入多张统计图与流程说明图；不使用 `publications.yml`。

**关系**：与英文研究页主题平行，信息架构不同；图片路径依赖 `assets/images/`。

**说明**：该文件体量较大，适合作为「对外中文叙事单一真源」；若未来希望中英同步更新，可考虑将中文块也迁移到数据文件或拆分 include。

---

### 2.9 `education.md` / `education_cn.md` —— 教育经历与履历 PDF

**职责**：列表化教育/职位时间线；提供 CV PDF 下载链接。

**关系**：PDF 存放于 `assets/documents/`；文件名在真实仓库中包含作者姓氏缩写，本文档不展开。

---

### 2.10 `rbm_recruit.md` / `rbm_recruit_cn.md` —— 项目招募页

**职责**：描述跨学科无人机物流数字孪生项目愿景、流程图、可行性报告下载、角色招募表、状态更新、合作联络方式。

**关系**：使用 `role-table` 等样式类，由 `assets/css/style.css` 定义表格容器阴影与行悬停高亮。

**注意点**：`rbm_recruit_cn.md` 前置元数据中 `lang: en` 与中文正文并存，可能导致侧栏姓名显示英文占位逻辑与读者预期不一致，属于后续可修正的配置卫生问题。

---

### 2.11 `js/language.js` —— 双语路由与导航同步（磁盘全文可引述）

```1:87:d:\Documents\Koar-create.github.io\js\language.js
// Function to get the base filename without extension or _cn suffix
function getBasePageName() {
    let path = window.location.pathname;
    if (path === '/' || path === '/index.html') {
        return 'index';  // Handle home page specially
    }
    let filename = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
    return filename.replace('_cn', '');
}

// Function to check if current page is Chinese version
function isChinesePage() {
    return window.location.pathname.includes('_cn');
}

// On page load, check stored language and redirect if mismatch
window.addEventListener('load', function() {
    const preferredLang = localStorage.getItem('preferredLang') || 'en'; // Default to 'en'
    const baseName = getBasePageName();
    const currentIsCn = isChinesePage();

    if (preferredLang === 'cn' && !currentIsCn) {
        // Redirect to Chinese version
        const newPath = (baseName === 'index') ? '/index_cn.html' : `/${baseName}_cn.html`;
        window.location.replace(newPath);
    } else if (preferredLang === 'en' && currentIsCn) {
        // Redirect to English version
        const newPath = (baseName === 'index') ? '/' : `/${baseName}.html`;
        window.location.replace(newPath);
    }

    // Update nav links and toggle button
    updateNavLinks(preferredLang);
    updateToggleButton(preferredLang);
});

// Function to toggle language
function toggleLanguage() {
    const currentLang = localStorage.getItem('preferredLang') || 'en';
    const newLang = currentLang === 'en' ? 'cn' : 'en';
    localStorage.setItem('preferredLang', newLang);

    // Redirect to the corresponding version of the current page
    const baseName = getBasePageName();
    if (newLang === 'cn') {
        const newPath = (baseName === 'index') ? '/index_cn.html' : `/${baseName}_cn.html`;
        window.location.replace(newPath);
    } else {
        const newPath = (baseName === 'index') ? '/' : `/${baseName}.html`;
        window.location.replace(newPath);
    }
}

// Function to update the toggle button's text
function updateToggleButton(lang) {
    const toggleElement = document.getElementById('lang-toggle');
    if (toggleElement) {
        toggleElement.textContent = lang === 'en' ? '中文' : 'English';
    }
}

// Dynamically update all nav links based on preferred lang
function updateNavLinks(lang) {
    const navLinks = document.querySelectorAll('nav a:not(#lang-toggle)'); // Adjust to your nav selector, exclude lang-toggle
    navLinks.forEach(link => {
        let href = link.getAttribute('href');
        if (href && !href.includes('_cn') && href !== 'javascript:void(0);') { // Only modify internal page links
            if (lang === 'cn') {
                if (href === '/' || href === '/index.html') {
                    link.setAttribute('href', '/index_cn.html');
                } else {
                    link.setAttribute('href', href.replace('.html', '_cn.html').replace(/\/$/, '_cn.html'));
                }
            } else {
                link.setAttribute('href', href.replace('_cn.html', '.html'));
            }
        }
    });
}

// Attach the toggle function to your language button
document.addEventListener('DOMContentLoaded', function() {
    const toggleElement = document.getElementById('lang-toggle');
    if (toggleElement) {
        toggleElement.addEventListener('click', toggleLanguage);
    }
});
```

**功能说明**：

- `getBasePageName` 对根路径特判为 `index`，否则剥离 `_cn` 得到「逻辑页名」。  
- `load` 时若偏好与 URL 不一致即 `replace`，避免用户每次手动切换；这也会造成**直接分享英文链接**的访问者在偏好为中文时被立即带走，属于产品层权衡。  
- `updateNavLinks` 通过 `nav a:not(#lang-toggle)` 选中导航条目，**假设**所有内部导航均为可字符串替换的 `.html` 形式；若未来加入锚点或查询串，需要扩展判断。  
- 中文模式下将 `/` 改为 `/index_cn.html`，与 `index_cn.md` 的 permalink 对齐。

---

### 2.12 `js/reveal.js` —— 滚动阶梯显现动画（磁盘全文可引述）

```1:57:d:\Documents\Koar-create.github.io\js\reveal.js
/**
 * reveal.js — Staggered scroll-entrance animation driver
 * Phase 2 of academic site modernization.
 *
 * Strategy:
 *  - Select all .reveal-item elements
 *  - Assign staggered --reveal-delay CSS custom properties
 *  - Use IntersectionObserver to add .is-visible when items enter the viewport
 *  - Graceful degradation: if IntersectionObserver is unavailable, show all items immediately
 */

(function () {
  'use strict';

  // Stagger config — keep short for academic sobriety
  var STAGGER_MS = 90;   // delay between consecutive items in same viewport sweep
  var THRESHOLD  = 0.12; // fraction of item height that must be visible to trigger

  var items = document.querySelectorAll('.reveal-item');
  if (!items.length) return;

  // --- Graceful degradation ---
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  // Track index within each "batch" so stagger resets per scroll event
  var visibleCount = 0;
  var batchTimer   = null;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !entry.target.classList.contains('is-visible')) {
        // Assign stagger delay relative to batch position
        var delay = (visibleCount * STAGGER_MS) / 1000;
        entry.target.style.setProperty('--reveal-delay', delay + 's');
        entry.target.classList.add('is-visible');
        visibleCount++;

        // Reset batch counter after a quiet period so next scroll starts fresh
        clearTimeout(batchTimer);
        batchTimer = setTimeout(function () { visibleCount = 0; }, 600);

        // Once visible, no need to keep observing
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: THRESHOLD,
    rootMargin: '0px 0px -40px 0px' // trigger slightly before item fully enters
  });

  items.forEach(function (el) { observer.observe(el); });
}());
```

**功能说明**：与 `style.css` 中 `.reveal-item` 初始 `opacity:0; translateY(22px)` 与 `.is-visible` 归位形成闭环；`--reveal-delay` 控制同一批进入视口元素的时间错开，避免「齐刷刷弹出」的廉价感，同时参数保守以符合学术站点气质。

---

### 2.13 `js/features.js` —— 主题、进度条、BibTeX 复制（磁盘全文可引述）

```1:103:d:\Documents\Koar-create.github.io\js\features.js
/**
 * features.js - Phase 4 Additions
 * Includes: Dark Mode Toggle, Reading Progress Bar, Copy BibTeX
 */

(function () {
  'use strict';

  // 1. Theme (Dark Mode) Toggle
  var themeToggle = document.getElementById('theme-toggle');
  var icon = themeToggle ? themeToggle.querySelector('i') : null;
  
  // Apply saved theme on load
  var currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (icon) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      var targetTheme = 'light';
      
      if (document.documentElement.getAttribute('data-theme') !== 'dark') {
        targetTheme = 'dark';
        document.documentElement.setAttribute('data-theme', 'dark');
        if(icon) {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
        }
      } else {
        document.documentElement.removeAttribute('data-theme');
        if(icon) {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
        }
      }
      localStorage.setItem('theme', targetTheme);
    });
  }

  // 2. Reading Progress Bar
  window.addEventListener('scroll', function() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // Only attempt if there's sufficient scrollable height
    if (height > 0) {
      var scrolled = (winScroll / height) * 100;
      var myBar = document.getElementById('myBar');
      if (myBar) {
        myBar.style.width = scrolled + '%';
      }
    }
  });

  // 3. Copy BibTeX Functionality
  // Export to global scope since it's triggered via inline `onclick`
  window.copyBibtex = function(id) {
    var bibtexElement = document.getElementById(id);
    if (!bibtexElement) return;

    var bibtexText = bibtexElement.textContent || bibtexElement.innerText;
    
    // Fallback for older browsers
    const fallbackCopy = function(text) {
      var textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {}
      document.body.removeChild(textArea);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(bibtexText).catch(function() {
        fallbackCopy(bibtexText);
      });
    } else {
      fallbackCopy(bibtexText);
    }

    // Temporary UX feedback
    var btn = event.currentTarget || event.target;
    var originalText = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.color = 'var(--color-brand)';
    btn.style.borderColor = 'var(--color-brand)';
    
    setTimeout(function() {
      btn.textContent = originalText;
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  };

})();
```

**功能说明**：暗色模式在「点击设置 dark」与「点击回到 light」两条分支上，`localStorage` 写入的 `targetTheme` 变量语义与 DOM 状态在边界条件下应再人工验算一次（例如从系统偏好读取的扩展需求目前未实现）。阅读进度条使用整页可滚动高度估算，短页面 `height<=0` 时不更新。`copyBibtex` 在 HTTPS 环境优先 `navigator.clipboard`。

---

### 2.14 `assets/css/style.css` —— 全站视觉与组件样式（结构与令牌节选）

**职责**：字体、导航悬停下划线动画、粘性顶栏、侧栏与主栏布局、社交图标悬停、`.reveal-item` 动画、响应式断点、`role-table` 表格皮肤、暗色令牌覆写。

**关系**：所有 `layout: default` 页面依赖；`cafe/` 页面不引用此文件（自包含样式）。

**节选**（设计令牌与 reveal 样式，磁盘原文节选）：

```1:43:d:\Documents\Koar-create.github.io\assets\css\style.css
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;600;700&display=swap');

/* =============================================================================
   Design Tokens — extracted from inline magic values for future theming
   ========================================================================== */
:root {
  --color-text:          #333333;
  --color-text-muted:    #555555;
  --color-brand:         #0056b3;
  --color-brand-hover:   #0077b5;
  --color-bg-page:       #ffffff;
  --color-bg-header:     #f8f8f8;
  --color-bg-sidebar:    #f9f9f9;
  --color-border:        #dddddd;
  --color-border-light:  #eeeeee;
  --color-border-table:  #e9ecef;
  --color-bg-table-head: #f8f9fa;
  --color-bg-table-row-hover: #f1f5f9;
  --color-shadow:        rgba(0, 0, 0, 0.1);
  --color-shadow-table:  rgba(0, 0, 0, 0.05);

  --font-body: 'Lato', sans-serif;
}

/* =============================================================================
   Dark Mode Token Overrides
   ========================================================================== */
[data-theme="dark"] {
  --color-text:          #e0e0e0;
  --color-text-muted:    #a0a0a0;
  --color-brand:         #4ea8ff;
  --color-brand-hover:   #82c4ff;
  --color-bg-page:       #121212;
  --color-bg-header:     #1e1e1e;
  --color-bg-sidebar:    #1a1a1a;
  --color-border:        #333333;
  --color-border-light:  #2a2a2a;
  --color-border-table:  #333333;
  --color-bg-table-head: #222222;
  --color-bg-table-row-hover: #2a2a2a;
  --color-shadow:        rgba(0, 0, 0, 0.4);
  --color-shadow-table:  rgba(0, 0, 0, 0.5);
}
```

```246:261:d:\Documents\Koar-create.github.io\assets\css\style.css
.reveal-item {
  opacity: 0;
  transform: translateY(22px);
  transition:
    opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  /* Stagger delay: driven by --reveal-delay CSS var set inline by JS */
  transition-delay: var(--reveal-delay, 0s);
}

/* Visible state toggled by IntersectionObserver when item crosses threshold */
.reveal-item.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

**功能说明**：以令牌驱动暗色模式，避免为 dark 单独复制整套规则；表格部分对 thead 与 tbody hover 做对比度处理；第一列角色名以品牌色强调，服务招募页阅读扫描。

---

### 2.15 `Gemfile` / `Gemfile.lock` —— Ruby 依赖锁定

**职责**：声明 Jekyll 与 minima 版本；锁文件记录解析后的完整依赖图。

**关系**：GitHub Pages 构建可能使用平台自带版本策略；本地开发应以 Bundler 结果为准。

```1:3:d:\Documents\Koar-create.github.io\Gemfile
source "https://rubygems.org"
gem "jekyll", "~> 4.4.1"
gem "minima"
```

---

### 2.16 `.gitignore` —— 版本控制忽略规则

```1:5:d:\Documents\Koar-create.github.io\.gitignore
index.html
Archive/
_site/
*.jpg
*.png
```

**功能说明**：忽略构建输出与部分静态图片格式会影响协作克隆体验，已在 Part 1.7 说明风险。

---

### 2.17 `cafe/menu_v4.html` 与 `cafe/js/beans.json` —— 咖啡子项目

**职责**：`menu_v4.html` 为较新版本菜单页，内嵌完整 CSS 与版式逻辑（顶部提示条、粘性 header、价格点状填充排版、响应式约束等）；`beans.json` 为结构化豆子档案，字段涵盖国家/产区/处理法/烘焙度/风味/推荐饮品/是否可售等。

**关系**：与 Jekyll 内容模型独立；部署时作为静态文件被访问。

**说明**：该类文件体量极大，本文不全文粘贴 `menu_v4.html`；其工程价值体现在「单 HTML 自包含交付物」与「JSON 数据源驱动前端渲染」的组合，可复用到线下门店屏显或小程序 WebView。

---

### 2.18 `utils/print_directory_tree.py` —— 目录树打印

**职责**：递归打印 `├──`/`└──` 风格树。

**关系**：不参与站点构建；路径常量需按本机仓库位置修改。

**匿名化说明**：脚本内示例路径可能指向作者本机目录，公开分享仓库时建议改为相对路径或 CLI 参数。

---

### 2.19 `scratch/extract_pptx.py` —— 幻灯片文本抽取草稿

**职责**：演示 `python-pptx` 读取幻灯片文本的最小脚本；硬编码 `path = r"…本地盘符…pptx"`。

**关系**：与站点无关；可能包含本机同步目录路径，属隐私/环境信息，**不建议**在公开文档复述真实路径。

---

## 附录 A：`research_cn.md` 与 `research.md` 的「双轨内容模型」深度对比

### A.1 设计动机层面的推测与工程后果

英文研究页采用 `_data/publications.yml` 的核心收益，在于把「同一逻辑实体的多个展示块」拆为数组，使得 Liquid 模板可以统一处理「标题栏 + BibTeX 按钮 + 多个 `reveal-item` 分段」这一重复结构。任何新增 publication，只需在 YAML 增加一个顶层列表项，不必复制粘贴大段 Markdown/HTML 模板，从**降低模板重复**与**提高一致性**两方面改善维护体验。

中文研究页选择把内容直接写入 `research_cn.md`，在工程上往往出于以下一种或多种原因：其一，中文排版与文言修辞使得作者更倾向于在单一文件中「所见即所得」地调整段落节奏，而不愿意在 YAML 的多重缩进与 HTML 转义中工作；其二，中文页可能包含与英文页**非严格一一对应**的补充叙述（例如更长的史地语境铺陈），若强行塞入同一 YAML schema，会导致字段语义膨胀；其三，Jekyll 构建期对 YAML 大小的解析与错误提示有时不如 Markdown 编辑器友好，长文作者可能因此选择 Markdown 主路径。

这一双轨模型的**代价**是明显的：同一研究主题的图表路径、阶段标题、结论性语句若在中英文之间需要同步修订，必须人工 diff 两个源文件，无法享受单一数据源的「一次编辑，多处渲染」红利。缓解策略包括：将中文块也迁移为 `_data/publications_cn.yml`；或引入构建前脚本从单一 JSON 生成两份语言文件；或使用 `include_relative` 将共享图表段落拆为 `_includes/research/fig_block_1.html` 等。若项目规模继续增长，建议评估迁移成本与编辑者工作流之间的平衡。

### A.2 滚动动画在研究页的差异化体验

英文研究页的 `reveal-item` 包裹粒度较细：每个 YAML `block` 往往对应一节图文组合，用户向下滚动时会看到内容以短暂阶梯方式显现。中文研究页未统一加 `reveal-item` 类（以当前文件为准），因此滚动体验更接近传统静态页「一次性绘制」。这会造成「英文研究页更动感、中文研究页更庄重」的观感差异；若希望统一品牌体验，可在中文 Markdown 外包一层 `<div class="reveal-item">`，但需注意中文长段落一次性淡入可能带来「大块空白后突然铺满」的视觉跳变，应配合分段。

### A.3 图像资源依赖链

两语言研究页均大量依赖 `/assets/images/` 下的 PNG/SVG 等。若 CI 或另一台机器克隆仓库后发现图片 404，应首先检查根 `.gitignore` 是否忽略了对应扩展名，其次检查发布分支是否使用 Git LFS 或外部对象存储。对于科研 reproducibility 角度，建议在未来 README（面向合作者）中补充「图像生成脚本或数据来源说明」，本 `README_verbose.md` 聚焦仓库结构，不展开科研数据处理管线。

---

## 附录 B：`rbm_recruit` 系列页面的信息设计与可维护性清单

### B.1 侧栏重复问题

`rbm_recruit.md` 与 `rbm_recruit_cn.md` 均在页面内复制侧栏 HTML，而不是 `{% include sidebar.html %}`。这会导致三类维护风险：第一，邮箱、社交链接、地址文案变更时需同时修改 include 版与多个内联版，遗漏概率随页面数线性上升；第二，`page.lang` 逻辑在 include 中统一处理，而内联版把姓名写死为某一语言字符串，若未来增加第三语言或调整 `lang` 字段语义，需要多处重构；第三，HTML 细节（例如 `strong` 标签、换行）容易出现轻微不一致，影响品牌统一性。

**建议的重构路径（概念性）**：将招募页也改为 `{% include sidebar.html %}`，并在 front matter 明确 `lang`；若招募页需要隐藏某些侧栏字段，可为 include 增加参数化 `{% include sidebar.html show_address=true %}`，用 Liquid 条件控制。

### B.2 `rbm_recruit_cn.md` 的 `lang` 元数据不一致问题

当前中文招募页 front matter 中存在 `lang: en` 与中文正文并存的现象。其直接后果是：`sidebar.html` 若被引用，会以 `page.lang == 'cn'` 判断失败，从而显示英文侧栏标签逻辑路径；尽管该文件当前使用内联侧栏而未触发该分支，但一旦未来改为 include，就会产生「中文正文 + 英文侧栏标签」的错配。修复方式是将 `lang` 改为 `cn`，并核对 `default.html` 中语言切换按钮显示逻辑是否仍正确（按钮显示由 URL 是否含 `_cn` 决定，与 `page.lang` 不完全耦合，但仍建议统一）。

### B.3 招募表格的语义结构

招募页使用 `div.table-container` 包裹 `table.role-table`，表头三列分别为角色名、核心使命、理想背景。该结构对屏幕阅读器友好性一般：未显式使用 `<caption>`；可考虑增加 `scope="col"`。从视觉角度，`style.css` 已为表头设置背景色、为行 hover 提供浅底色、为第一列角色名赋予品牌色，阅读扫描路径清晰。

### B.4 外链与文档下载的治理

招募页包含可行性报告 PDF 链接与流程 SVG 展示。此类资产属于「项目对外材料」，更新频率可能高于个人简介。建议在仓库层建立「文档版本命名规则」（日期戳或 semver），避免浏览器缓存旧 PDF；或在链接后附加查询版本串（需谨慎，影响缓存策略）。

---

## 附录 C：`cafe/` 子站点的版本迭代语义（`menu_v1`…`menu_v4`）

### C.1 为什么存在多版本菜单 HTML

在工程实践中，菜单页面对应线下运营需求变化（价格、品类、提示文案、排版）往往快于主站学术内容。将每次迭代保留为独立文件（`menu_v1.html`…）的价值在于：可以在线下评审或团队沟通时快速打开历史版本对比视觉效果，而不依赖 git diff 对巨型单文件的友好性（虽然理想状态应依赖版本控制而非文件复制）。从「站点访问者」角度，通常只暴露最新 `menu.html` 或 `menu_v4.html` 之一为主入口，具体以站内相互链接为准。

### C.2 `beans.json` 数据模式说明

数组元素字段覆盖产地英文/中文、产区、庄园/处理站、处理法、烘焙度、风味描述、推荐饮品及价格文案、可用性布尔值等。该 schema 对前端渲染的耦合点在于：字段命名采用 `countryEn`/`countryCn` 并列双语键，而非嵌套对象 `{locale: {}}`，这有利于扁平遍历，但增加字段膨胀成本。新增字段（例如「海拔」「采收季」）时应保持所有条目键集合一致，避免 `undefined` 访问。

### C.3 与主站的部署边界

`cafe` 页面不依赖 Jekyll front matter，意味着它们也可被原样复制到任意静态服务器根路径下运行。若主站自定义域名，而咖啡子路径仍挂在 `github.io` 子域，需处理跨域字体或第三方 CDN 策略；当前页面主要使用系统衬线与 Web 安全字体栈，风险较低。

---

## 附录 D：`Archived/` 与 `Archive/` 目录的保存策略与风险

### D.1 `Archived/` 浏览器保存页

该目录包含完整 HTML 与 `_files` 子目录（内联或相对引用的 CSS）。此类快照用于「对照早期线上渲染结果」非常有价值，但文件名来自浏览器保存标题，往往携带个人姓名。对外公开仓库时，除文档匿名化外，亦可考虑重命名文件去除个人标识（属仓库治理决策，不在本会话中自动改动物理文件名）。

### D.2 `Archive/` 轻量版本

`index.v0.html`、`index.v1.html` 与 `style_0921.css` 暗示某个日期的样式迭代实验。它们体积较小，适合快速 diff 颜色与排版参数。若未来清理仓库，应确认这些文件是否仍被 `_site` 或其他入口引用。

---

## 附录 E：安全、隐私与合规的静态站点注意点（概念清单）

1. **邮箱暴露**：`mailto:` 链接可被爬虫采集；若担忧垃圾邮件，可使用联系表单中间层或图片化邮箱（可用性与无障碍下降）。  
2. **Google Site Verification**：验证 meta 或 HTML 文件属于站点控制权证明，泄露一般风险有限，但仍属敏感配置。  
3. **第三方 CDN**：Font Awesome 与 Google Fonts 引入外部请求，涉及 GDPR/CCPA 语境下的「数据传输」讨论；可改为自托管 webfont 与本地图标 SVG。  
4. **PDF 元数据**：上传前可使用 PDF 工具清理作者名、创建者软件痕迹等元数据。  
5. **历史快照**：`Archived` HTML 可能包含旧外链或旧跟踪参数，定期审查避免死链与误导向。

---

## 附录 F：`js` 与 `Liquid` 协同边界 FAQ

**问：为何语言切换使用整页 `replace` 而不是前端 i18n JSON？**  
答：当前实现零构建 i18n 基础设施成本，且每个语言版本允许完全不同的 HTML 结构（中文研究页即显著不同）。代价是重复请求与无法保持滚动位置。

**问：`updateNavLinks` 是否处理子路径 baseurl？**  
答：脚本以 `href` 字符串替换为核心，若站点部署在子路径（`site.baseurl` 非空），需验证 `_config.yml` 与 `relative_url` 过滤器生成的前缀是否导致替换规则失效；当前布局导航使用 `relative_url`，在子路径部署时应更谨慎测试。

**问：`copyBibtex` 是否可能在无用户手势环境失败？**  
答：部分浏览器对剪贴板 API 需要安全上下文与用户激活；已提供 `execCommand` 回退路径。

---

## 附录 G：`current_directory_tree.txt` 与 `utils/print_directory_tree.py` 的关系

根目录 `current_directory_tree.txt` 当前几乎为空占位，而 `utils/print_directory_tree.py` 可生成更完整的树。二者并未通过 CI 自动同步，存在「文档与现实漂移」可能。若希望 `current_directory_tree.txt` 成为规范树导出，可在 CI 中运行脚本重定向输出并提交；或在 pre-commit 钩子中更新。

---

## 附录 H：`Gemfile.lock` 的平台特异性提示

`Gemfile.lock` 中出现 `x64-mingw-ucrt` 等平台标记，说明曾在 Windows UCRT 环境解析依赖。其他操作系统重新 `bundle install` 可能产生锁文件差异。团队协作时，应以 CI 的 Ruby 版本与平台为基准统一锁文件，或在文档声明「仅某平台锁定」。

---

## 附录 I：与 GitHub Pages 默认构建行为的对照（高层）

GitHub Pages 的 Jekyll 构建环境对插件白名单、默认依赖版本有平台约束；本地使用 Jekyll 4.4.1 引入的插件若在 Pages 上不可用，可能导致构建失败或静默降级。站点当前依赖自定义布局与数据文件，属于 Jekyll 核心能力范围内的高兼容性子集；若未来加入非白名单插件，需要调整构建方式（例如 GitHub Actions 自定义 workflow 构建并推送 `_site` 到 `gh-pages` 分支等策略）。

---

## 附录 J：无障碍（a11y）与阅读体验的进一步改进空间（建议性）

1. 为图片补充更长 `alt` 文本，尤其是研究图包含科学信息时，`alt` 应描述关键结论而非仅「Research Image 1」。  
2. 语言切换按钮使用 `button` 元素语义或 `role="button"` +键盘支持，而非仅 `javascript:void(0)` 锚点。  
3. 为表格增加 `<caption>` 与列 `scope`。  
4. 深色模式下检查表头文字色 `#212529` 是否仍满足对比度（当前为固定色，未走令牌）。

---

## 结语

本文档从**信息架构、模板与数据流、脚本行为、样式系统、附属静态站点与工具脚本**多个层次，对仓库进行了尽量细致的拆解与串联说明，并通过多个附录把**双轨研究内容模型、招募页维护清单、cafe 子项目版本语义、归档策略、隐私合规注意点、脚本与 Liquid 边界 FAQ、锁文件平台性、GitHub Pages 对照、a11y 改进空间**等议题展开到工程维护者通常需要的心智模型粒度；对涉及个人信息之处执行了**一致的匿名化策略**。若后续项目演进中新增页面，建议同步更新：导航配置、语言切换路径特判表、`sidebar` 内联与 include 的双轨合并计划、`_data` 的 schema 文档、以及静态资源是否纳入版本控制的策略说明，以保持长期可维护性与协作透明度。
