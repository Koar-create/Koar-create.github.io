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