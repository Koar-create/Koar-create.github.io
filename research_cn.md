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
    <h2>
      癸卯岁岭南暴雨破纪案牍
    </h2>
    <p>
      <strong>提要&nbsp;&nbsp;</strong>
      癸卯白露之交，南土见亘古未遇之霖。余操WRF之器以究玄机，二百七十余调参之试犹难复现日雨四百毫米之观，足证预报此类异象之艰。敏析示积云参数实为枢机，尤异者，成败早判于九霄动力之场，此乃外域积云方案取舍所致。故知罡风沆瀣垂运之变，实为先兆。至若云衢如何接地泻银潢，犹待剖玄。
    </p>
    <p>
      <strong>缘起&nbsp;&nbsp;</strong>
      癸卯(2023)年桂月(九月)初，飓风「海葵」挟威叩闽，旋移粤土而散。然其残魄盘桓湾區二昼夜，迫低压槽接西南季风，遂启九月七日夜暴雨之枢。
    </p>
    <img src="/assets/images/background.png" alt="Research Image 1" style="max-width:800px; height:auto;">
    <hr>
    <p>
      <strong>验效</strong>
      <br>&nbsp;&nbsp;&nbsp;&nbsp;• 二百七十余调参之试各呈异效，泰半难拟日雨六百毫米之极，盖此象百年不遇。
      <br>&nbsp;&nbsp;&nbsp;&nbsp;• 五试独善，与实测契若符节，误差异乎其微。
      <br>&nbsp;&nbsp;&nbsp;&nbsp;• 当深究此五试成功之物理枢机，以明其妙。
      <br><img src="/assets/images/pattern_ACC-RMSE-TS.png" alt="Research Image 2" style="max-width:800px; height:auto;">
    </p>
    <p>
      <br>&nbsp;&nbsp;&nbsp;&nbsp;• 择模拟降水最精者，立为<strong>基准之试</strong>。
      <br>&nbsp;&nbsp;&nbsp;&nbsp;• 依基准更易三要法：积云参数、微物理、边界层（详见下文）。
      <br>&nbsp;&nbsp;&nbsp;&nbsp;• 效验昭然：扰动积云参数所致雨强衰减，远甚于更易微物理或边界层之法。
      <br>&nbsp;&nbsp;&nbsp;&nbsp;• <strong>由是观之，</strong>外域积云参数之择，其关乎降水模拟之效，尤胜微物理之变。
    </p>
    <p style="display:flex; gap:50px;">
      <img src="/assets/images/sensitivity_analysis_1.png" alt="Research Image 3" style="max-height:200px; width:auto;">
      <img src="/assets/images/sensitivity_analysis_2.png" alt="Research Image 4" style="max-height:200px; width:auto;">
    </p>
    <hr>
    <p>
    时序均值取乙巳年桂月初四日未正至酉初（世界协时二零二五年九月四日十四至十七时）。<br>
    <img src="/assets/images/U_ano.0412_0414.png" alt="Research Image 5" style="max-width:800px; height:auto;">
    <br>时序均值取乙巳年桂月初五日卯正至巳初（世界协时二零二五年九月五日至六时）。<br>
    <img src="/assets/images/U_ano.0506_0508.png" alt="Research Image 6" style="max-width:800px; height:auto;">
    </p>
    <p>
      <br>&nbsp;&nbsp;&nbsp;&nbsp;• 实验肇始之际，尝比照基准组与积云扰动组在动力场与热力场之异同。
      <br>&nbsp;&nbsp;&nbsp;&nbsp;• 基准与扰动之判，首现于<strong>高层</strong>动力场中，此乃外域积云方案取舍所致。
      <br>&nbsp;&nbsp;&nbsp;&nbsp;• 推演其理：盖积云方案影响外域动量水汽之垂输，遂成霄壤之别。个中机理，<u>犹在探赜索隐。</u>
    </p>
    <hr>
    <h2>第二阶段：城市尺度风场降尺度之WRF-OpenFOAM耦合研究</h2>
    <p>
      承首阶段之绪，余自乙巳(2025)年立冬后，转而研求中尺度背景下之城市微尺度风场重构。通过单向耦合<strong>WRF中尺度模型</strong>与<strong>OpenFOAM流体计算(CFD)求解器</strong>，建成了一套足以解析城市下垫面复杂气动效应（如楼宇尾流、街道峡谷）的降尺度技术链路。
    </p>
    <p>
      <strong>效验成果&nbsp;&nbsp;</strong>
      此框架已于广州珠江新城CBD区域，本诸多站<strong>LiDAR垂直测风观测</strong>完成验证。凡三时次（零时、四时、八时世界协时）之统计皆示<strong>Skill Score (SS > 0)</strong>，足证CFD模型于城市低层大气边界层中，其纠正中尺度偏差之功甚伟。
      <br><em>注：十二时(1200 UTC)之试因大气层结稳健，湍流受抑，不契合稳态RANS之法，故略之。</em>
    </p>
    <p style="text-align:center;">
      <img src="/assets/images/fig4_simple_ws_profiles_fixed.png" alt="风速剖面" style="max-width:800px; height:auto;">
      <br><em>图一：广州四站LiDAR实测、WRF与OpenFOAM CFD模型之垂直风速剖面比照。</em>
    </p>
    <p style="text-align:center;">
      <img src="/assets/images/fig2_taylor_diagram.png" alt="泰勒图" style="max-width:600px; height:auto;">
      <br><em>图二：泰勒图示CFD降尺度结果在相关性与误差分布上之优化。</em>
    </p>
    <p>
      <strong>后续方向&nbsp;&nbsp;</strong>
      余下课题，一者在于施行<strong>下垫面粗糙度分离边界策略</strong>，以除地表参数重复计算之弊；二者计划由RANS晋为<strong>LES/WMLES（大涡模拟）</strong>，旨在捕捉阵风瞬变及非高斯湍流特征，以为低空经济（如无人机航安）供其础石。
    </p>
  </div>
</div>
