---
layout: default
title: Home
---

<style>
  body {
    font-family: "Times New Roman", serif;
  }
  .container {
    display: flex;
    height: 100vh;  /* 确保容器填满页面高度 */
  }
  .sidebar {
    width: 20vw; /* 改为视口宽度单位 */
    padding: 20px;
    border-right: 5px solid #ccc;
    text-align: left;
    position: fixed;
    /* top: 60px; */
    left: 0px;
    height: 100vh;
    background-color: #f9f9f9;
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
    width: 40vw; /* 改为视口宽度单位 */
    left: 30vw;
    position: fixed;
  }
</style>

<div class="container">
  <div class="sidebar">
    <img src="/assets/images/Protrait.jpg" alt="Protrait" width="235" height="289">
    <h2>Zhixian Yang</h2>
    <p>Email: yangzhx28@mail2.sysu.edu.cn</p>
    <p>Address: Duxue Road No.1, Nansha District, Guangzhou</p>
  </div>
  <div class="content">
    <div class="bio">
      <h1>Bio</h1>
      <p>
        I am a student who aspires to work in the atmospheric science industry. My areas of interest include weather and climate modeling, and how to improve the model's ability to reproduce extreme events.
      </p>
    </div>
  </div>
</div>
