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
  }
  .sidebar {
    width: 20%;
    padding: 10px;
    border-right: 1px solid #ccc;
    text-align: center;
  }
  .sidebar img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
  }
  .content {
    width: 80%;
    padding: 10px;
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
</style>

<div class="container">
  <div class="sidebar">
    <img src="https://via.placeholder.com/100" alt="Profile Picture">
    <h2>Your Name</h2>
    <p>Email: yangzhx28@mail2.sysu.edu.cn</p>
    <p>Phone: +86 188-****-1717</p>
    <p>Address: Duxue Road No.1, Nansha District, Guangzhou</p>
  </div>
  <div class="content">
    <div class="tabs">
      <a href="/research">Research</a>
      <a href="/education">Education</a>
    </div>
    <div class="bio">
      <h2>Bio</h2>
      <p>
        (dont take these bio for true, am just testing)
        I am a passionate researcher with a focus on developing sustainable solutions
        for environmental challenges. My work spans computational modeling, data analysis, 
        and field experiments. I enjoy collaborating with interdisciplinary teams to push 
        the boundaries of science and innovation.
      </p>
    </div>
  </div>
</div>
