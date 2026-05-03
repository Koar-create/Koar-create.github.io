# AUTO-CHECKPOINT

## 会话任务（Jekyll 学术站四项痛点）

1. **暗色模式**：在 `assets/css/style.css` 的 `[data-theme="dark"]` 下增加主栏/主内容/带 inline background 的 `div` 等安全网规则；`body`/`main` 使用 `var(--color-bg-page)`；表头 `th` 文字改为 `var(--color-text)`；修正 `js/features.js` 主题切换时 `localStorage` 写入逻辑（此前 `targetTheme` 初值导致写入错误）。
2. **语言切换**：出站 `body.lang-fade-out` + `sessionStorage.justSwitchedLang`；进站 `html.lang-entering` + `pageEnter`（见下方 FIX 1）；`prefers-reduced-motion: reduce` 时跳过入场动画。
3. **中文出版物数据**：新增 `_data/publications_cn.yml`（与英文结构一致）；`research_cn.md` 改为与 `research.md` 相同的数据驱动循环。
4. **页脚 Café**：`_config.yml` 的 `footer` 增加指向 `/cafe/menu.html` 的链接；`cafe/menu*.html` 中硬编码 `#fff` 面板改为 `var(--bg-color)`。另修正 `rbm_recruit_cn.md` 的 `lang: cn`。

## 会话任务（FIX 1 / 暗色首屏 + 语言进入 — 后续修订）

- **首屏暗色**：`_layouts/default.html` 在**首个**样式表 `<link>` 之前插入阻塞内联脚本：读 `localStorage.theme`，若为 `dark` 则对 **`document.documentElement`** 设置 `data-theme="dark"`，并同步添加 **`theme-ready`**；紧随 `<noscript><style>html{visibility:visible}</style></noscript>`。`style.css` 在 `@import` 与 `:root` 之间增加 **`html { visibility:hidden }` / `html.theme-ready { visibility:visible }`**。
- **`js/features.js`**：主题仅由阻塞脚本应用；`DOMContentLoaded` 上 **`initThemeToggle`** 只同步月亮/太阳图标并绑定切换（切换时仍写 `localStorage`）。
- **语言切换**：`language.js` 出站仍为 **`body.lang-fade-out`** + 180ms 后 `replace`；进站若存在 `sessionStorage.justSwitchedLang` 则对 **`document.documentElement`** 加 **`lang-entering`**，在 **`.site-wrapper`** 上监听 **`pageEnter`** 的 `animationend` 后移除（`pageEnter` 为 opacity + `translateY(6px)`；无 `.site-wrapper` 的页面跳过进入动画）。`prefers-reduced-motion` 下不加重入场类；合并的 reduce 媒体查询中含 **`html.lang-entering * { animation:none!important }`**。
- **`_layouts/default.html`**：用 **`<div class="site-wrapper">`** 包裹 `header` / `main` / `footer`，供 `pageEnter` 单一动画目标，避免与内部 `main` 双重动画。

## 会话任务（FIX 4 — Café 入口）

- **`_layouts/default.html`**：在 `<footer>` 内增加 `.footer-cafe-link` 侧栏入口（`relative_url`），含 **Cafe Menu**、**About**、**Events**（仓库内 `cafe/about_us.html`、`cafe/events.html` 已存在）；版权行保留为 `site.footer`。**未**向 `_config.yml` 的 `navigation` 添加 café。
- **`assets/css/style.css`**：`.site-footer`、`.footer-cafe-link` 等样式（弱对比、悬停与主站链接一致、明暗色用现有 CSS 变量、与版权区间距）。
- **`_config.yml`**：`footer` 恢复为纯版权句，避免与布局内 Café 区块重复。
- **`cafe/menu.html`**：在顶栏 `header-nav` 增加 `../index.html` 的 **Back to main site** 链接（仅此 HTML 增补，沿用 `.menu-link`）。

## 完成状态

- [x] `bundle exec jekyll build` 通过（仅有 Minima/Sass 既有弃用警告）
- [x] `ruby -e "require 'yaml'; YAML.load_file('_data/publications_cn.yml')"` 通过
- [x] 已阅读用户指定的布局、样式、脚本、含区与页面后再改代码

## 会话任务（FIX 3 — 中文研究页数据驱动）

- **`_data/publications_cn.yml`**：在文件首增加 YAML 注释头（中文数据源说明、`id` 与 `publications.yml` 对照）；条目结构保持与英文一致（`title` / `id` / `bibtex` / `blocks` 下 `html: |`）。
- **`research_cn.md`**：保留页首中文引言段；正文改为 `{% for pub in site.data.publications_cn %}`，每条为 **`publication-entry reveal-item`**，**`<h3>{{ pub.title }}</h3>`**，BibTeX 为 **「复制 BibTeX」** 按钮 + 隐藏 `<pre>`；**`{% for block in pub.blocks %}`** 输出 **`{{ block.html }}`**，每块包在 **`reveal-item`** 中，块间 **`{% unless forloop.first %}<hr>{% endunless %}`**，条目间保留 **`{% unless forloop.last %}<hr>{% endunless %}`**。未改动 `publications.yml` 与 `research.md`。

## 会话任务（sidebar 单文件 include 同步）

- **`index_cn.md`、`rbm_recruit.md`、`rbm_recruit_cn.md`**：删除内联 `<div class="sidebar">…</div>`，改为 `{% include sidebar.html %}`，与 `index.md`、`research.md`、`research_cn.md` 一致；中英文仍由各页 front matter 的 `lang: en` / `lang: cn` 驱动 `_includes/sidebar.html` 内的条件渲染。

## 备注

- 主站设计令牌为 `--color-bg-page` / `--color-text`（非 `--bg-color`）；暗色安全网按现有 `:root` 变量书写。
- `cafe/menu_v4.html` 已阅读；侧栏/弹窗白底已改为 `var(--bg-color)`（与咖啡页内 `--bg-color` 一致）。
