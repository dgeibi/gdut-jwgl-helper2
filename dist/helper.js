// ==UserScript==
// @name         gdut-jwgl-helper2
// @namespace    https://github.com/dgeibi/gdut-jwgl-helper2
// @version      0.3.3
// @description  make http://222.200.98.147/ better.
// @copyright    2013-2016 VTM STUDIO
// @copyright    2017 dgeibi
// @match        http://222.200.98.147/*
// ==/UserScript==

var courseBlackList = [];

(function () {
'use strict';

// https://github.com/vtmer/gdut-jwgl-helper
var router = function () { return ({
  routes: {},
  beforeRoutes: [],
  before: function before(callback) {
    this.beforeRoutes.push(callback);
    return this;
  },
  on: function on(pattern, callback) {
    var compiledPattern;
    var key = pattern.toString();
    if (!(key in this.routes)) {
      if (pattern instanceof RegExp) {
        compiledPattern = pattern;
      } else {
        compiledPattern = new RegExp(("^" + key + "$"));
      }

      this.routes[key] = {
        regExp: compiledPattern,
        callbacks: [],
      };
    }
    this.routes[key].callbacks.push(callback);
    return this;
  },
  run: function run(_url) {
    // 默认使用不带最开始 back slash 的 `location.pathname`
    var url = _url || window.location.pathname.slice(1);
    // 执行预先运行的回调函数组
    this.beforeRoutes.forEach(function (callback) {
      callback();
    });

    // 检查是否有满足条件的回调函数
    var foundMatched = false;
    var self = this;
    Object.keys(this.routes).forEach(function (pattern) {
      var route = self.routes[pattern];
      if (!route.regExp.test(url)) { return; }
      foundMatched = true;
      route.callbacks.forEach(function (callback) {
        callback();
      });
    });
    return foundMatched;
  },
}); };

function download(url, filename) {
  var link = document.createElement('a');
  if (link.download !== undefined) {
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.dispatchEvent(new MouseEvent('click'));
  }
}

var courseTimes = [
  { start: '08:30', end: '09:15' },
  { start: '09:20', end: '10:05' },
  { start: '10:25', end: '11:10' },
  { start: '11:15', end: '12:00' },
  { start: '13:50', end: '14:35' },
  { start: '14:40', end: '15:25' },
  { start: '15:30', end: '16:15' },
  { start: '16:30', end: '17:15' },
  { start: '17:20', end: '18:05' },
  { start: '18:30', end: '19:15' },
  { start: '19:20', end: '20:05' },
  { start: '20:10', end: '20:55' } ];

var calendar = function (courseBlackList) { return function () {
  var bottomRow = document.getElementsByClassName('datagrid-pager')[0].children[0].children[0]
    .rows[0];
  var select = bottomRow.cells[0].children[0];
  [].forEach.call(select.options, function (option) {
    option.innerText = '1000';
  });

  // click Refresh Button
  bottomRow.cells[12].children[0].click();

  // create Export Button
  var exportBtn = document.createElement('button');
  exportBtn.type = 'button';
  exportBtn.style.cursor = 'pointer';
  exportBtn.innerText = '导出课表';
  exportBtn.onclick = function () {
    exportICS(courseBlackList);
  };

  // append Export Button
  var cell = document.createElement('td');
  cell.align = 'right';
  cell.appendChild(exportBtn);
  var topRow = document.getElementById('ff').children[0].rows[0];
  topRow.insertAdjacentElement('afterbegin', cell);
}; };

// getTime("2017-03-09","08:30") => "20170309T003000Z"
function getTime(dateStr, timeStr) {
  var date = new Date((dateStr + "T" + timeStr + ":00+08:00"));
  return date
    .toISOString()
    .replace(/\.\d\d\d/, '')
    .replace(/[-:]/g, '');
}

function exportICS(courseBlackList) {
  var table = document.querySelector('.datagrid-body .datagrid-btable');
  var filename = "course" + (Date.now()) + ".ics";
  var url = 'data:text/calendar;charset=utf-8,';
  var ics =
    'BEGIN:VCALENDAR\n' +
    'PRODID:-//dgeibi/gdut-jwgl-helper//Calendar 1.0//EN\n' +
    'VERSION:2.0\n' +
    'CALSCALE:GREGORIAN\n' +
    'METHOD:PUBLISH\n' +
    'X-WR-CALNAME:课程表\n' +
    'X-WR-TIMEZONE:Asia/Shanghai\n';

  [].forEach.call(table.rows, function (row) {
    var cells = row.cells;
    var date = cells[8].firstChild.innerText;
    var orderRaw = cells[6].firstChild.innerText;
    var startOrder = orderRaw.slice(0, 2) - 1;
    var endOrder = orderRaw.slice(-2) - 1;
    var courseStartTime = courseTimes[startOrder].start;
    var courseEndTime = courseTimes[endOrder].end;
    var location = cells[7].firstChild.innerText;
    var courseName = cells[0].firstChild.innerText;
    var weekCount = cells[4].firstChild.innerText;
    var teacher = cells[3].firstChild.innerText;

    if (courseBlackList.indexOf(courseName) >= 0) { return; }
    ics += 'BEGIN:VEVENT\n';
    ics += "DTSTART:" + (getTime(date, courseStartTime)) + "\n";
    ics += "DTEND:" + (getTime(date, courseEndTime)) + "\n";
    ics += "LOCATION:" + location + "\n";
    ics += "SUMMARY:" + courseName + "\n";
    ics += "" + ('DESCRIPTION:第') + weekCount + "周\\n" + teacher + "\n";
    ics += 'END:VEVENT\n';
  });
  ics += 'END:VCALENDAR\n';
  url += encodeURIComponent(ics);

  // download ics file
  download(url, filename);
}

var GPA = {
  // 等级对应成绩
  //
  // - 免修、优秀： 95
  // - 良好：85
  // - 中等：75
  // - 及格：65
  // - 不及格： 0
  // - 重修：0
  realScore: function realScore(score) {
    if (score === '免修') { return 95; }
    else if (score === '优秀') { return 95; }
    else if (score === '良好') { return 85; }
    else if (score === '中等') { return 75; }
    else if (score === '及格') { return 65; }
    else if (score === '不及格') { return 0; }
    else if (score === '') {
      // 没有填写的情况当作 0 （出现在重修栏）
      return 0;
    }
    return parseFloat(score);
  },

  // 计算一门课程的学分绩点
  //
  // 计算公式：
  //
  //      CreditGPA = Credit * GPA
  creditGPA: function creditGPA(lecture) {
    return lecture.credit * lecture.gpa;
  },

  // 计算若干门课程的总绩点
  sumCredit: function sumCredit(lectures) {
    return lectures.reduce(function (sum, lecture) { return sum + lecture.credit; }, 0);
  },

  // 计算若干门课程的平均分
  avgScore: function avgScore(lectures) {
    if (lectures.length === 0) {
      return 0;
    }

    return (
      lectures.reduce(function (sum, lecture) { return sum + GPA.realScore(lecture.grade.score); }, 0) /
      lectures.length
    );
  },

  // 计算若干门课程的平均学分绩点
  avgCreditGPA: function avgCreditGPA(lectures) {
    if (lectures.length === 0) {
      return 0;
    }

    var sumCreditGPA = lectures.reduce(function (sum, lecture) { return sum + GPA.creditGPA(lecture); }, 0);

    return sumCreditGPA / GPA.sumCredit(lectures);
  },

  // 计算若干门课程的加权平均分
  avgWeightedScore: function avgWeightedScore(lectures) {
    if (lectures.length === 0) {
      return 0;
    }

    var sumWeighedScore = lectures.reduce(
      function (sum, lecture) { return lecture.credit * GPA.realScore(lecture.grade.score) + sum; },
      0
    );

    return sumWeighedScore / GPA.sumCredit(lectures);
  },
};

// ## 课程成绩记录定义
//
// * code        :  课程代码
// * name        :  课程名称
// * type        :  课程大类（公共基础？专业基础？）
// * attribution :  课程归属（人文社科？工程基础？）
// * grade:
//    - score    :  课程成绩
//    - type     :  考试性质
// * credit      :  学分
// * gpa         :  绩点
function Lecture() {
  this.code = null;
  this.name = null;
  this.type = null;
  this.attribution = null;
  this.credit = 0.0;
  this.grade = {
    score: 0.0,
    type: null,
  };
  this.gpa = 0.0;
}

var parseText = function (x) { return String(x).trim(); };

var parseFloatOrText = function (x) {
  var parsedText = parseText(x);
  var parsedFloat = parseFloat(parsedText);
  return isNaN(parsedFloat) ? parsedText : parsedFloat;
};

var parseText$ = function (x) { return parseText($(x).text()); };

var parseFloatOrText$ = function (x) {
  var parsedText = parseText$(x);
  var parsedFloat = parseFloat(parsedText);
  return isNaN(parsedFloat) ? parsedText : parsedFloat;
};

// 从 `table tr` 中获取一个课程信息
Lecture.fromTableRow = function (row) {
  var $cols = $('td', row);
  var lecture = new Lecture();
  var take = function (idx, parser) { return parser($cols[idx]); };

  lecture.code = take(3, parseText$);
  lecture.name = take(4, parseText$);
  lecture.grade.score = take(5, parseFloatOrText$) || 0.0;
  lecture.grade.type = take(13, parseText$);
  lecture.gpa = lecture.grade.type === '正常考试' ? take(6, parseFloatOrText$) || 0.0 : 0.0;
  lecture.credit = take(8, parseFloatOrText$);
  lecture.type = take(9, parseText$);
  lecture.attribution = take(10, parseText$);

  return lecture;
};

Lecture.fromObj = function (row) {
  var lecture = new Lecture();
  var take = function (key, parser) { return (parser ? parser(row[key]) : row[key]); };

  lecture.name = take('kcmc', parseText);
  lecture.grade.score = take('zcj', parseFloatOrText) || 0.0;
  lecture.grade.type = take('ksxzmc', parseText);
  lecture.gpa = lecture.grade.type === '正常考试' ? take('cjjd', parseFloatOrText) || 0.0 : 0.0;
  lecture.credit = take('xf', parseFloatOrText);

  return lecture;
};

Lecture.fromObjs = function (rows) { return rows.map(Lecture.fromObj); };

// 从 `table` 中获取一系列课程信息
Lecture.fromRows = function (rows) { return $.map(rows, Lecture.fromTableRow); };

function enlargeThreshold(change) {
  var bottomRow = document.getElementsByClassName('datagrid-pager')[0].children[0].children[0]
    .rows[0];
  var select = bottomRow.cells[0].children[0];
  Array.prototype.forEach.call(select.options, function (option) {
    option.innerText = '1000';
  });
  select.value = '1000';
  if (change) { $(select).change(); }
}

function fetchScoreData(callback) {
  return $.ajax({
    type: 'POST',
    url: 'xskccjxx!getDataList.action?miao',
    data: 'xnxqdm=&jhlxdm=&page=1&rows=1000&sort=xnxqdm&order=asc',
    dataType: 'json',
    success: callback,
  });
}

var score = function () {
  enlargeThreshold(true);

  var scoreDatas = null;

  // 页面元素
  var $infoRows = $('#tb table tbody');
  var $scoreTableHead = $('table.datagrid-htable tbody tr');

  $('#tb').height('auto');

  // 插入汇总栏: 平均绩点、平均分、加权平均分
  var $avgRow = $('<tr></tr>').appendTo($infoRows);
  var $avgGPA = $('<td></td>').appendTo($avgRow);
  var $avgScore = $('<td></td>').appendTo($avgRow);
  var $weightedAvgScore = $('<td></td>').appendTo($avgRow);

  var $allYearRow = $('<tr></tr>').appendTo($infoRows);
  var $allYearAvgGPA = $('<td></td>').appendTo($allYearRow);
  var $allYearAvgScore = $('<td></td>').appendTo($allYearRow);
  var $allYearWeightedAvgScore = $('<td></td>').appendTo($allYearRow);

  // 表头
  $('<td style="width: 50px; text-align: center;">学分绩点</td>').appendTo($scoreTableHead);
  $('<td style="width: 50px; text-align: center;">全选 <input type="checkbox" class="lecture-check-all" checked /></td>').appendTo($scoreTableHead);

  // 各行
  var rowCellsTmpl = [
    '<td class="credit-gpa" style="width: 50px; text-align: center;"></td>',
    '<td style="width: 50px; text-align: center;"><input type="checkbox" class="lecture-check" /></td>' ];

  // 重新计算汇总成绩
  var renderSelected = function () {
    var checkedRows = $('.lecture-check:checked')
      .parent()
      .parent();
    var lectures = Lecture.fromRows(checkedRows);

    $avgGPA.text(("平均绩点：" + (GPA.avgCreditGPA(lectures).toFixed(2))));
    $avgScore.text(("平均分：" + (GPA.avgScore(lectures).toFixed(2))));
    $weightedAvgScore.text(("加权平均分：" + (GPA.avgWeightedScore(lectures).toFixed(2))));
  };

  $('.lecture-check-all').change(function () {
    // 同步勾选状态
    $('.lecture-check').prop('checked', $('.lecture-check-all').is(':checked'));

    // 触发重新计算汇总栏
    renderSelected();
  });

  function renderAllYear() {
    if (scoreDatas) {
      var from = $('#xnxqdm')[0].value.slice(0, 4);
      if (from !== '') {
        var rows = scoreDatas.filter(function (x) { return x.xnxqdm.indexOf(from) === 0; });
        var lectures = Lecture.fromObjs(rows);
        var to = String(Number(from) + 1);
        $allYearAvgGPA.text(("[" + from + "-" + to + "学年] 平均绩点：" + (GPA.avgCreditGPA(lectures).toFixed(2))));
        $allYearAvgScore.text(("平均分：" + (GPA.avgScore(lectures).toFixed(2))));
        $allYearWeightedAvgScore.text(("加权平均分：" + (GPA.avgWeightedScore(lectures).toFixed(2))));
      } else {
        $allYearAvgGPA.text('');
        $allYearAvgScore.text('');
        $allYearWeightedAvgScore.text('');
      }
    }
  }

  fetchScoreData(function (ref) {
    var rows = ref.rows;

    scoreDatas = rows;
    renderAllYear();
  });

  function bindTable() {
    var $scoreRows = $('table.datagrid-btable tbody tr');

    // 课程信息
    var lectures = Lecture.fromRows($scoreRows);

    // 插入各行汇总栏: 学分绩点、是否加入计算
    $(rowCellsTmpl.join('')).appendTo($scoreRows);

    $scoreRows.each(function (i, row) {
      var $row = $(row);
      var lecture = lectures[i];
      $row.find('.credit-gpa').text(GPA.creditGPA(lecture).toFixed(2));
    });

    // 绑定各栏的勾选事件
    $scoreRows.click(function clickRow(e) {
      var $target = $(e.target);
      if ($target.is('.l-btn-text') || $target.is('.lecture-check')) { return; }
      var $checkbox = $(this).find('input.lecture-check');
      $checkbox.prop('checked', !$checkbox.prop('checked')).trigger('change');
    });

    $('.lecture-check').change(renderSelected);
    $('.lecture-check-all').trigger('change');
  }

  function afterLoad(event, xhr, settings) {
    if (settings.url !== 'xskccjxx!getDataList.action') { return; }
    enlargeThreshold(false);
    bindTable();
    renderAllYear();
  }

  $(document).ajaxSuccess(afterLoad);
};

var page = router();
page.on(/^xskccjxx!xskccjList\.action/, score);
page.on(/^xsgrkbcx!xskbList2\.action/, calendar(courseBlackList));
page.run();

}());
