// ==UserScript==
// @name         gdut-jwgl-helper2
// @namespace    https://github.com/dgeibi/gdut-jwgl-helper2
// @version      0.3.5
// @description  make jxfw.gdut.edu.cn great again
// @copyright    2013-2016 VTM STUDIO
// @copyright    2017-2018 dgeibi
// @match        http://222.200.98.146/*
// @match        http://222.200.98.147/*
// @match        http://jxfw.gdut.edu.cn/*
// ==/UserScript==

var courseBlackList = [];

(function () {
  'use strict';

  // https://github.com/vtmer/gdut-jwgl-helper
  var router = (() => ({
    routes: {},
    beforeRoutes: [],

    before(callback) {
      this.beforeRoutes.push(callback);
      return this;
    },

    on(pattern, callback) {
      let compiledPattern;
      const key = pattern.toString();

      if (!(key in this.routes)) {
        if (pattern instanceof RegExp) {
          compiledPattern = pattern;
        } else {
          compiledPattern = new RegExp(`^${key}$`);
        }

        this.routes[key] = {
          regExp: compiledPattern,
          callbacks: []
        };
      }

      this.routes[key].callbacks.push(callback);
      return this;
    },

    run(_url) {
      // 默认使用不带最开始 back slash 的 `location.pathname`
      const url = _url || window.location.pathname.slice(1); // 执行预先运行的回调函数组


      this.beforeRoutes.forEach(callback => {
        callback();
      }); // 检查是否有满足条件的回调函数

      let foundMatched = false;
      const self = this;
      Object.keys(this.routes).forEach(pattern => {
        const route = self.routes[pattern];
        if (!route.regExp.test(url)) return;
        foundMatched = true;
        route.callbacks.forEach(callback => {
          callback();
        });
      });
      return foundMatched;
    }

  }));

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var FileSaver = createCommonjsModule(function (module) {
  /* FileSaver.js
   * A saveAs() FileSaver implementation.
   * 1.3.2
   * 2016-06-16 18:25:19
   *
   * By Eli Grey, http://eligrey.com
   * License: MIT
   *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
   */

  /*global self */
  /*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

  /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

  var saveAs = saveAs || (function(view) {
  	// IE <10 is explicitly unsupported
  	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
  		return;
  	}
  	var
  		  doc = view.document
  		  // only get URL when necessary in case Blob.js hasn't overridden it yet
  		, get_URL = function() {
  			return view.URL || view.webkitURL || view;
  		}
  		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
  		, can_use_save_link = "download" in save_link
  		, click = function(node) {
  			var event = new MouseEvent("click");
  			node.dispatchEvent(event);
  		}
  		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
  		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
  		, throw_outside = function(ex) {
  			(view.setImmediate || view.setTimeout)(function() {
  				throw ex;
  			}, 0);
  		}
  		, force_saveable_type = "application/octet-stream"
  		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
  		, arbitrary_revoke_timeout = 1000 * 40 // in ms
  		, revoke = function(file) {
  			var revoker = function() {
  				if (typeof file === "string") { // file is an object URL
  					get_URL().revokeObjectURL(file);
  				} else { // file is a File
  					file.remove();
  				}
  			};
  			setTimeout(revoker, arbitrary_revoke_timeout);
  		}
  		, dispatch = function(filesaver, event_types, event) {
  			event_types = [].concat(event_types);
  			var i = event_types.length;
  			while (i--) {
  				var listener = filesaver["on" + event_types[i]];
  				if (typeof listener === "function") {
  					try {
  						listener.call(filesaver, event || filesaver);
  					} catch (ex) {
  						throw_outside(ex);
  					}
  				}
  			}
  		}
  		, auto_bom = function(blob) {
  			// prepend BOM for UTF-8 XML and text/* types (including HTML)
  			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
  			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
  				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
  			}
  			return blob;
  		}
  		, FileSaver = function(blob, name, no_auto_bom) {
  			if (!no_auto_bom) {
  				blob = auto_bom(blob);
  			}
  			// First try a.download, then web filesystem, then object URLs
  			var
  				  filesaver = this
  				, type = blob.type
  				, force = type === force_saveable_type
  				, object_url
  				, dispatch_all = function() {
  					dispatch(filesaver, "writestart progress write writeend".split(" "));
  				}
  				// on any filesys errors revert to saving with object URLs
  				, fs_error = function() {
  					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
  						// Safari doesn't allow downloading of blob urls
  						var reader = new FileReader();
  						reader.onloadend = function() {
  							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
  							var popup = view.open(url, '_blank');
  							if(!popup) view.location.href = url;
  							url=undefined; // release reference before dispatching
  							filesaver.readyState = filesaver.DONE;
  							dispatch_all();
  						};
  						reader.readAsDataURL(blob);
  						filesaver.readyState = filesaver.INIT;
  						return;
  					}
  					// don't create more object URLs than needed
  					if (!object_url) {
  						object_url = get_URL().createObjectURL(blob);
  					}
  					if (force) {
  						view.location.href = object_url;
  					} else {
  						var opened = view.open(object_url, "_blank");
  						if (!opened) {
  							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
  							view.location.href = object_url;
  						}
  					}
  					filesaver.readyState = filesaver.DONE;
  					dispatch_all();
  					revoke(object_url);
  				}
  			;
  			filesaver.readyState = filesaver.INIT;

  			if (can_use_save_link) {
  				object_url = get_URL().createObjectURL(blob);
  				setTimeout(function() {
  					save_link.href = object_url;
  					save_link.download = name;
  					click(save_link);
  					dispatch_all();
  					revoke(object_url);
  					filesaver.readyState = filesaver.DONE;
  				});
  				return;
  			}

  			fs_error();
  		}
  		, FS_proto = FileSaver.prototype
  		, saveAs = function(blob, name, no_auto_bom) {
  			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
  		}
  	;
  	// IE 10+ (native saveAs)
  	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
  		return function(blob, name, no_auto_bom) {
  			name = name || blob.name || "download";

  			if (!no_auto_bom) {
  				blob = auto_bom(blob);
  			}
  			return navigator.msSaveOrOpenBlob(blob, name);
  		};
  	}

  	FS_proto.abort = function(){};
  	FS_proto.readyState = FS_proto.INIT = 0;
  	FS_proto.WRITING = 1;
  	FS_proto.DONE = 2;

  	FS_proto.error =
  	FS_proto.onwritestart =
  	FS_proto.onprogress =
  	FS_proto.onwrite =
  	FS_proto.onabort =
  	FS_proto.onerror =
  	FS_proto.onwriteend =
  		null;

  	return saveAs;
  }(
  	   typeof self !== "undefined" && self
  	|| typeof window !== "undefined" && window
  	|| commonjsGlobal.content
  ));
  // `self` is undefined in Firefox for Android content script context
  // while `this` is nsIContentFrameMessageManager
  // with an attribute `content` that corresponds to the window

  if (module.exports) {
    module.exports.saveAs = saveAs;
  }
  });
  var FileSaver_1 = FileSaver.saveAs;

  const courseTimes = [{
    start: '08:30',
    end: '09:15'
  }, {
    start: '09:20',
    end: '10:05'
  }, {
    start: '10:25',
    end: '11:10'
  }, {
    start: '11:15',
    end: '12:00'
  }, {
    start: '13:50',
    end: '14:35'
  }, {
    start: '14:40',
    end: '15:25'
  }, {
    start: '15:30',
    end: '16:15'
  }, {
    start: '16:30',
    end: '17:15'
  }, {
    start: '17:20',
    end: '18:05'
  }, {
    start: '18:30',
    end: '19:15'
  }, {
    start: '19:20',
    end: '20:05'
  }, {
    start: '20:10',
    end: '20:55'
  }]; // getTime("2017-03-09","08:30") => "20170309T003000Z"

  function getTime(dateStr, timeStr) {
    const date = new Date(`${dateStr}T${timeStr}:00+08:00`);
    return date.toISOString().replace(/\.\d\d\d/, '').replace(/[-:]/g, '');
  }

  function exportICS(courseBlackList) {
    const table = document.querySelector('.datagrid-body .datagrid-btable');
    const filename = `course${Date.now()}.ics`;
    let ics = 'BEGIN:VCALENDAR\n' + 'PRODID:-//dgeibi/gdut-jwgl-helper//Calendar 1.0//EN\n' + 'VERSION:2.0\n' + 'CALSCALE:GREGORIAN\n' + 'METHOD:PUBLISH\n' + 'X-WR-CALNAME:课程表\n' + 'X-WR-TIMEZONE:Asia/Shanghai\n';
    [].forEach.call(table.rows, row => {
      const cells = row.cells;
      const date = cells[8].firstChild.innerText;
      const orderRaw = cells[6].firstChild.innerText;
      const startOrder = orderRaw.slice(0, 2) - 1;
      const endOrder = orderRaw.slice(-2) - 1;
      const courseStartTime = courseTimes[startOrder].start;
      const courseEndTime = courseTimes[endOrder].end;
      const location = cells[7].firstChild.innerText;
      const courseName = cells[0].firstChild.innerText;
      const weekCount = cells[4].firstChild.innerText;
      const teacher = cells[3].firstChild.innerText;
      if (courseBlackList.indexOf(courseName) >= 0) return;
      ics += 'BEGIN:VEVENT\n';
      ics += `DTSTART:${getTime(date, courseStartTime)}\n`;
      ics += `DTEND:${getTime(date, courseEndTime)}\n`;
      ics += `LOCATION:${location}\n`;
      ics += `SUMMARY:${courseName}\n`;
      ics += `${'DESCRIPTION:第'}${weekCount}周\\n${teacher}\n`;
      ics += 'END:VEVENT\n';
    });
    ics += 'END:VCALENDAR\n';
    FileSaver.saveAs(new Blob([ics]), filename);
  }

  var calendar = (courseBlackList => () => {
    const bottomRow = document.getElementsByClassName('datagrid-pager')[0].children[0].children[0].rows[0];
    const select = bottomRow.cells[0].children[0];
    [].forEach.call(select.options, option => {
      option.innerText = '1000';
    }); // click Refresh Button

    bottomRow.cells[12].children[0].click(); // create Export Button

    const exportBtn = document.createElement('button');
    exportBtn.type = 'button';
    exportBtn.style.cursor = 'pointer';
    exportBtn.innerText = '导出课表';

    exportBtn.onclick = () => {
      exportICS(courseBlackList);
    }; // append Export Button


    const cell = document.createElement('td');
    cell.align = 'right';
    cell.appendChild(exportBtn);
    const topRow = document.getElementById('ff').children[0].rows[0];
    topRow.insertAdjacentElement('afterbegin', cell);
  });

  const GPA = {
    // 等级对应成绩
    //
    // - 免修、优秀： 95
    // - 良好：85
    // - 中等：75
    // - 及格：65
    // - 不及格： 0
    // - 重修：0
    realScore(score) {
      if (score === '免修') return 95;else if (score === '优秀') return 95;else if (score === '良好') return 85;else if (score === '中等') return 75;else if (score === '及格') return 65;else if (score === '不及格') return 0;else if (score === '') {
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
    creditGPA(lecture) {
      return lecture.credit * lecture.gpa;
    },

    // 计算若干门课程的总绩点
    sumCredit(lectures) {
      return lectures.reduce((sum, lecture) => sum + lecture.credit, 0);
    },

    // 计算若干门课程的平均分
    avgScore(lectures) {
      if (lectures.length === 0) {
        return 0;
      }

      return lectures.reduce((sum, lecture) => sum + GPA.realScore(lecture.grade.score), 0) / lectures.length;
    },

    // 计算若干门课程的平均学分绩点
    avgCreditGPA(lectures) {
      if (lectures.length === 0) {
        return 0;
      }

      const sumCreditGPA = lectures.reduce((sum, lecture) => sum + GPA.creditGPA(lecture), 0);
      return sumCreditGPA / GPA.sumCredit(lectures);
    },

    // 计算若干门课程的加权平均分
    avgWeightedScore(lectures) {
      if (lectures.length === 0) {
        return 0;
      }

      const sumWeighedScore = lectures.reduce((sum, lecture) => lecture.credit * GPA.realScore(lecture.grade.score) + sum, 0);
      return sumWeighedScore / GPA.sumCredit(lectures);
    }

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
      type: null
    };
    this.gpa = 0.0;
  }

  const parseText = x => String(x).trim();

  const parseFloatOrText = x => {
    const parsedText = parseText(x);
    const parsedFloat = parseFloat(parsedText);
    return Number.isNaN(parsedFloat) ? parsedText : parsedFloat;
  };

  const parseText$ = x => parseText($(x).text());

  const parseFloatOrText$ = x => {
    const parsedText = parseText$(x);
    const parsedFloat = parseFloat(parsedText);
    return Number.isNaN(parsedFloat) ? parsedText : parsedFloat;
  }; // 从 `table tr` 中获取一个课程信息


  Lecture.fromTableRow = row => {
    const $cols = $('td', row);
    const lecture = new Lecture();

    const take = (idx, parser) => parser($cols[idx]);

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

  Lecture.fromObj = row => {
    const lecture = new Lecture();

    const take = (key, parser) => parser ? parser(row[key]) : row[key];

    lecture.name = take('kcmc', parseText);
    lecture.grade.score = take('zcj', parseFloatOrText) || 0.0;
    lecture.grade.type = take('ksxzmc', parseText);
    lecture.gpa = lecture.grade.type === '正常考试' ? take('cjjd', parseFloatOrText) || 0.0 : 0.0;
    lecture.credit = take('xf', parseFloatOrText);
    return lecture;
  };

  Lecture.fromObjs = rows => rows.map(Lecture.fromObj); // 从 `table` 中获取一系列课程信息


  Lecture.fromRows = rows => $.map(rows, Lecture.fromTableRow);

  function enlargeThreshold(change) {
    const bottomRow = document.getElementsByClassName('datagrid-pager')[0].children[0].children[0].rows[0];
    const select = bottomRow.cells[0].children[0];
    Array.prototype.forEach.call(select.options, option => {
      option.innerText = '1000';
    });
    select.value = '1000';
    if (change) $(select).change();
  }

  function fetchScoreData(callback) {
    return $.ajax({
      type: 'POST',
      url: 'xskccjxx!getDataList.action?miao',
      data: 'xnxqdm=&jhlxdm=&page=1&rows=1000&sort=xnxqdm&order=asc',
      dataType: 'json',
      success: callback
    });
  }

  var score = (() => {
    enlargeThreshold(true);
    let scoreDatas = null; // 页面元素

    const $infoRows = $('#tb table tbody');
    const $scoreTableHead = $('table.datagrid-htable tbody tr');
    $('#tb').height('auto'); // 插入汇总栏: 平均绩点、平均分、加权平均分

    const $avgRow = $('<tr></tr>').appendTo($infoRows);
    const $avgGPA = $('<td></td>').appendTo($avgRow);
    const $avgScore = $('<td></td>').appendTo($avgRow);
    const $weightedAvgScore = $('<td></td>').appendTo($avgRow);
    const $allYearRow = $('<tr></tr>').appendTo($infoRows);
    const $allYearAvgGPA = $('<td></td>').appendTo($allYearRow);
    const $allYearAvgScore = $('<td></td>').appendTo($allYearRow);
    const $allYearWeightedAvgScore = $('<td></td>').appendTo($allYearRow); // 表头

    $('<td style="width: 50px; text-align: center;">学分绩点</td>').appendTo($scoreTableHead);
    $('<td style="width: 50px; text-align: center;">全选 <input type="checkbox" class="lecture-check-all" checked /></td>').appendTo($scoreTableHead); // 各行

    const rowCellsTmpl = ['<td class="credit-gpa" style="width: 50px; text-align: center;"></td>', '<td style="width: 50px; text-align: center;"><input type="checkbox" class="lecture-check" /></td>']; // 重新计算汇总成绩

    const renderSelected = () => {
      const checkedRows = $('.lecture-check:checked').parent().parent();
      const lectures = Lecture.fromRows(checkedRows);
      $avgGPA.text(`平均绩点：${GPA.avgCreditGPA(lectures).toFixed(2)}`);
      $avgScore.text(`平均分：${GPA.avgScore(lectures).toFixed(2)}`);
      $weightedAvgScore.text(`加权平均分：${GPA.avgWeightedScore(lectures).toFixed(2)}`);
    };

    $('.lecture-check-all').change(() => {
      // 同步勾选状态
      $('.lecture-check').prop('checked', $('.lecture-check-all').is(':checked')); // 触发重新计算汇总栏

      renderSelected();
    });

    function renderAllYear() {
      if (scoreDatas) {
        const from = $('#xnxqdm')[0].value.slice(0, 4);

        if (from !== '') {
          const rows = scoreDatas.filter(x => x.xnxqdm.indexOf(from) === 0);
          const lectures = Lecture.fromObjs(rows);
          const to = String(Number(from) + 1);
          $allYearAvgGPA.text(`[${from}-${to}学年] 平均绩点：${GPA.avgCreditGPA(lectures).toFixed(2)}`);
          $allYearAvgScore.text(`平均分：${GPA.avgScore(lectures).toFixed(2)}`);
          $allYearWeightedAvgScore.text(`加权平均分：${GPA.avgWeightedScore(lectures).toFixed(2)}`);
        } else {
          $allYearAvgGPA.text('');
          $allYearAvgScore.text('');
          $allYearWeightedAvgScore.text('');
        }
      }
    }

    fetchScoreData(({
      rows
    }) => {
      scoreDatas = rows;
      renderAllYear();
    });

    function bindTable() {
      const $scoreRows = $('table.datagrid-btable tbody tr'); // 课程信息

      const lectures = Lecture.fromRows($scoreRows); // 插入各行汇总栏: 学分绩点、是否加入计算

      $(rowCellsTmpl.join('')).appendTo($scoreRows);
      $scoreRows.each((i, row) => {
        const $row = $(row);
        const lecture = lectures[i];
        $row.find('.credit-gpa').text(GPA.creditGPA(lecture).toFixed(2));
      }); // 绑定各栏的勾选事件

      $scoreRows.click(function clickRow(e) {
        const $target = $(e.target);
        if ($target.is('.l-btn-text') || $target.is('.lecture-check')) return;
        const $checkbox = $(this).find('input.lecture-check');
        $checkbox.prop('checked', !$checkbox.prop('checked')).trigger('change');
      });
      $('.lecture-check').change(renderSelected);
      $('.lecture-check-all').trigger('change');
    }

    function afterLoad(event, xhr, settings) {
      if (settings.url !== 'xskccjxx!getDataList.action') return;
      enlargeThreshold(false);
      bindTable();
      renderAllYear();
    }

    $(document).ajaxSuccess(afterLoad);
  });

  const page = router();
  page.on(/^xskccjxx!xskccjList\.action/, score);
  page.on(/^xsgrkbcx!xskbList2\.action/, calendar(courseBlackList));
  page.run();

}());
