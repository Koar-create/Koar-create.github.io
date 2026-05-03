---
layout: default
permalink: /research_cn.html
title: Research
lang: cn
---

<div class="container">
  {% include sidebar.html %}
  <div class="content">
    <h1>研究</h1>
    <p>
      今仆所攻者，乃WRF数值模型重演癸卯(2023)岁仲秋粤港澳破纪暴雨之能。凡行二百七十余试，泰半未逮雨峰之极。考评之据，皆本天官监当日所录仪象。
    </p>
    <hr>

    {% for pub in site.data.publications_cn %}
    <div class="publication-entry reveal-item">
      <h3>{{ pub.title }}</h3>
      {% if pub.bibtex %}
      <button class="bibtex-btn" onclick="copyBibtex('{{ pub.id }}')" style="font-size: 14px; padding: 4px 10px; cursor: pointer; border: 1px solid var(--color-border); background: var(--color-bg-page); color: var(--color-text-muted); border-radius: 4px; transition: all 0.2s;">复制 BibTeX</button>
      <pre id="{{ pub.id }}" style="display: none;">{{ pub.bibtex }}</pre>
      {% endif %}
      {% for block in pub.blocks %}
      {% unless forloop.first %}<hr>{% endunless %}
      <div class="reveal-item">{{ block.html }}</div>
      {% endfor %}
    </div>
    {% unless forloop.last %}<hr>{% endunless %}
    {% endfor %}

  </div>
</div>
