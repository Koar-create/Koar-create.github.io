# AUTO-CHECKPOINT

## Task: 字体升级 — Cormorant Garamond + Crimson Pro

**Status:** 完成  
**Date:** 2026-06-12

---

### 目标

按设计建议将站点衬线字体从 Fraunces + Source Serif 4 升级为 **Cormorant Garamond（标题）+ Crimson Pro（正文）**，并微调暗色模式对比度与小字号可读性。

### 修改文件

| 文件 | 变更 |
|---|---|
| `src/styles/tokens.css` | `--font-display` / `--font-body` 换字体；浅色背景 `#f0ede8`；暗色 `--color-text-muted` / `--color-text-subtle` 提亮 |
| `src/layouts/Base.astro` | Google Fonts 链接改为 Cormorant Garamond + Crimson Pro + JetBrains Mono |
| `src/styles/global.css` | 正文渲染优化（`text-rendering`、`font-feature-settings`）；Hero 名与卡片描述微调字重/行高 |

### 保留

- 强调色 `#ff3b00` 未改动（与建议一致）
- JetBrains Mono 仍用于导航、标签、元数据

### 验证

```
npm run build → 21 pages OK
```

---

## 历史：修复 ClientRouter 导航后空白页（2026-06-12）

- `Base.astro` 监听 `astro:page-load` 重新添加 `theme-ready`

## 历史：衬线字体站点重新设计（2026-06-11）

- 初版 Fraunces + Source Serif 4、紧凑 Hero、页脚联系信息、Cafe Tab 等
