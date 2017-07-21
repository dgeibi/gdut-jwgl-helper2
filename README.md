# gdut-jwgl-helper2

## 功能

### 计算平均绩点和平均分

根据学生手册中提供的公式计算平均绩点，平均分和加权平均分。计算各科学分绩点。

### 导出课程表到日历文件

#### 课程表黑名单

通过修改代码添加黑名单：

``` javascript
var courseBlackList = ["大学英语(4)","软件工程"]
```

#### 导出步骤

课表查询 -> 周次（全部）-> 查询课表 -> 列表展示 -> 导出课表

#### 使用 ics 文件

导入 Outlook 日历，Google Calendar

## 安装

### Chrome

__方法 1__

Open "chrome://extensions", enable "Developer mode",
click "Load unpacked extension..." and select the directory of gdut-jwgl-helper.

__方法 2__

安装 [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)，复制 helper.js 到 Tampermonkey。

### Firefox

__方法 1__

Open "about:debugging", click "Load Temporary Add-on" and select any file in
gdut-jwgl-helper's directory.

__方法 2__

安装 [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)，添加
helper.js。
