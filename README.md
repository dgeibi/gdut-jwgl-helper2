# gdut-jwgl-helper2

基于 [vtmer/gdut-jwgl-helper](https://github.com/vtmer/gdut-jwgl-helper)，对新教务系统进行适配。

## 功能

### 计算平均绩点和平均分

根据学生手册中提供的公式计算平均绩点，平均分和加权平均分。计算各科学分绩点。

### 导出课程表到日历文件

添加课程黑名单：

``` javascript
// 修改 helper.js 如下
var courseBlackList = ["大学英语(4)","软件工程"];
```

导出步骤：课表查询 -> 周次（全部）-> 查询课表 -> 列表展示 -> 导出课表

使用 ics 文件：导入 Outlook 日历或 Google Calendar。

## 安装

### Chrome

方法 1：Open "chrome://extensions", enable "Developer mode",
click "Load unpacked extension..." and select the directory `dist` of gdut-jwgl-helper.

方法 2：安装 [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)，复制 `dist/helper.js` 到 Tampermonkey。

### Firefox

方法 1：Open "about:debugging", click "Load Temporary Add-on" and
select any file in gdut-jwgl-helper's `dist` directory.

方法 2：安装 [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)，复制 `dist/helper.js` 到 Tampermonkey。

### 其它浏览器

安装 [Tampermonkey](http://tampermonkey.net/)，复制 `dist/helper.js` 到 Tampermonkey。
