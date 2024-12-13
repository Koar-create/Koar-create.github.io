---
layout: default
title: Home
---

<style>
  body {
    font-family: "Times New Roman", serif;
    margin: 0;  /* 移除默认边距 */
  }
  .container {
    display: flex;
    height: 100vh;  /* 确保容器填满页面高度 */
  }
  .sidebar {
    width: 20%;
    padding: 10px;
    border-right: 1px solid #ccc;
    text-align: center;
    position: fixed;  /* 使用固定定位，确保sidebar固定 */
    top: 0;  /* 从页面顶部开始 */
    left: 0;  /* 紧贴页面左侧 */
    height: 100vh;  /* 确保 sidebar 高度与页面一致 */
    background-color: #f9f9f9;  /* 可选：背景色以分隔内容 */
    z-index: 10; /* 确保sidebar层级高于content区域 */
  }
  .sidebar img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
  }
  .sidebar p {
    font-size: 0.8em;  /* 调小字体大小 */
  }
  .content {
    margin-left: 20%;  /* 使右侧内容区域避开sidebar */
    width: 80%;
    padding: 10px;
    margin-top: 50px; /* 确保内容区不被navbar遮挡 */
  }
  .tabs {
    display: flex;
    justify-content: space-around;
    margin-bottom: 10px;
  }
  .tabs a {
    text-decoration: none;
    font-weight: bold;
  }
  .bio {
    margin-top: 20px;
  }
  .bio h2 {
    font-weight: bold;
    text-align: left;
  }
  .navbar {
    z-index: 100; /* 确保navbar层级更高，避免sidebar遮挡 */
  }
</style>

<div class="container">
  <div class="sidebar">
    <img src="/assets/images/Protrait.jpg" alt="Protrait" width="235" height="289">
    <h2>Zhixian Yang</h2>
    <p>Email: yangzhx28@mail2.sysu.edu.cn</p>
    <p>Phone: +86 188-****-1717</p>
    <p>Address: Duxue Road No.1, Nansha District, Guangzhou</p>
  </div>
  <div class="content">
    <div class="bio">
      <h2>Bio</h2>
      <p>
        (dont take these bio for true, am just testing)<br>
        I am a passionate researcher with a focus on developing sustainable solutions
        for environmental challenges. My work spans computational modeling, data analysis, 
        and field experiments. I enjoy collaborating with interdisciplinary teams to push 
        the boundaries of science and innovation.
      </p>
    </div>
  </div>
</div>
