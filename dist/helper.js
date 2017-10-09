// ==UserScript==
// @name         gdut-jwgl-helper2
// @namespace    https://github.com/dgeibi/gdut-jwgl-helper2
// @version      0.3.4
// @description  make http://222.200.98.14{6,7}/ better.
// @copyright    2013-2016 VTM STUDIO
// @copyright    2017 dgeibi
// @match        http://222.200.98.146/*
// @match        http://222.200.98.147/*
// ==/UserScript==

var courseBlackList = [];

(function () {
'use strict';

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});
var _shared = function (key) {
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

// most Object methods by ES6 should accept primitives



var _objectSap = function (KEY, exec) {
  var fn = (_core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
};

// 19.1.2.14 Object.keys(O)



_objectSap('keys', function () {
  return function keys(it) {
    return _objectKeys(_toObject(it));
  };
});

var keys$1 = _core.Object.keys;

var keys = createCommonjsModule(function (module) {
module.exports = { "default": keys$1, __esModule: true };
});

var _Object$keys = unwrapExports(keys);

// https://github.com/vtmer/gdut-jwgl-helper
var router = (function () {
  return {
    routes: {},
    beforeRoutes: [],
    before: function before(callback) {
      this.beforeRoutes.push(callback);
      return this;
    },
    on: function on(pattern, callback) {
      var compiledPattern = void 0;
      var key = pattern.toString();
      if (!(key in this.routes)) {
        if (pattern instanceof RegExp) {
          compiledPattern = pattern;
        } else {
          compiledPattern = new RegExp("^" + key + "$");
        }

        this.routes[key] = {
          regExp: compiledPattern,
          callbacks: []
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
      _Object$keys(this.routes).forEach(function (pattern) {
        var route = self.routes[pattern];
        if (!route.regExp.test(url)) return;
        foundMatched = true;
        route.callbacks.forEach(function (callback) {
          callback();
        });
      });
      return foundMatched;
    }
  };
});

function download(url, filename) {
  var link = document.createElement('a');
  if (link.download !== undefined) {
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.dispatchEvent(new MouseEvent('click'));
  }
}

var courseTimes = [{ start: '08:30', end: '09:15' }, { start: '09:20', end: '10:05' }, { start: '10:25', end: '11:10' }, { start: '11:15', end: '12:00' }, { start: '13:50', end: '14:35' }, { start: '14:40', end: '15:25' }, { start: '15:30', end: '16:15' }, { start: '16:30', end: '17:15' }, { start: '17:20', end: '18:05' }, { start: '18:30', end: '19:15' }, { start: '19:20', end: '20:05' }, { start: '20:10', end: '20:55' }];

var calendar = (function (courseBlackList) {
  return function () {
    var bottomRow = document.getElementsByClassName('datagrid-pager')[0].children[0].children[0].rows[0];
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
  };
});

// getTime("2017-03-09","08:30") => "20170309T003000Z"
function getTime(dateStr, timeStr) {
  var date = new Date(dateStr + 'T' + timeStr + ':00+08:00');
  return date.toISOString().replace(/\.\d\d\d/, '').replace(/[-:]/g, '');
}

function exportICS(courseBlackList) {
  var table = document.querySelector('.datagrid-body .datagrid-btable');
  var filename = 'course' + Date.now() + '.ics';
  var url = 'data:text/calendar;charset=utf-8,';
  var ics = 'BEGIN:VCALENDAR\n' + 'PRODID:-//dgeibi/gdut-jwgl-helper//Calendar 1.0//EN\n' + 'VERSION:2.0\n' + 'CALSCALE:GREGORIAN\n' + 'METHOD:PUBLISH\n' + 'X-WR-CALNAME:课程表\n' + 'X-WR-TIMEZONE:Asia/Shanghai\n';

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

    if (courseBlackList.indexOf(courseName) >= 0) return;
    ics += 'BEGIN:VEVENT\n';
    ics += 'DTSTART:' + getTime(date, courseStartTime) + '\n';
    ics += 'DTEND:' + getTime(date, courseEndTime) + '\n';
    ics += 'LOCATION:' + location + '\n';
    ics += 'SUMMARY:' + courseName + '\n';
    ics += 'DESCRIPTION:第' + weekCount + '\u5468\\n' + teacher + '\n';
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
  creditGPA: function creditGPA(lecture) {
    return lecture.credit * lecture.gpa;
  },


  // 计算若干门课程的总绩点
  sumCredit: function sumCredit(lectures) {
    return lectures.reduce(function (sum, lecture) {
      return sum + lecture.credit;
    }, 0);
  },


  // 计算若干门课程的平均分
  avgScore: function avgScore(lectures) {
    if (lectures.length === 0) {
      return 0;
    }

    return lectures.reduce(function (sum, lecture) {
      return sum + GPA.realScore(lecture.grade.score);
    }, 0) / lectures.length;
  },


  // 计算若干门课程的平均学分绩点
  avgCreditGPA: function avgCreditGPA(lectures) {
    if (lectures.length === 0) {
      return 0;
    }

    var sumCreditGPA = lectures.reduce(function (sum, lecture) {
      return sum + GPA.creditGPA(lecture);
    }, 0);

    return sumCreditGPA / GPA.sumCredit(lectures);
  },


  // 计算若干门课程的加权平均分
  avgWeightedScore: function avgWeightedScore(lectures) {
    if (lectures.length === 0) {
      return 0;
    }

    var sumWeighedScore = lectures.reduce(function (sum, lecture) {
      return lecture.credit * GPA.realScore(lecture.grade.score) + sum;
    }, 0);

    return sumWeighedScore / GPA.sumCredit(lectures);
  }
};

// 20.1.2.4 Number.isNaN(number)


_export(_export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

var isNan$1 = _core.Number.isNaN;

var isNan = createCommonjsModule(function (module) {
module.exports = { "default": isNan$1, __esModule: true };
});

var _Number$isNaN = unwrapExports(isNan);

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

var parseText = function parseText(x) {
  return String(x).trim();
};

var parseFloatOrText = function parseFloatOrText(x) {
  var parsedText = parseText(x);
  var parsedFloat = parseFloat(parsedText);
  return _Number$isNaN(parsedFloat) ? parsedText : parsedFloat;
};

var parseText$ = function parseText$(x) {
  return parseText($(x).text());
};

var parseFloatOrText$ = function parseFloatOrText$(x) {
  var parsedText = parseText$(x);
  var parsedFloat = parseFloat(parsedText);
  return _Number$isNaN(parsedFloat) ? parsedText : parsedFloat;
};

// 从 `table tr` 中获取一个课程信息
Lecture.fromTableRow = function (row) {
  var $cols = $('td', row);
  var lecture = new Lecture();
  var take = function take(idx, parser) {
    return parser($cols[idx]);
  };

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
  var take = function take(key, parser) {
    return parser ? parser(row[key]) : row[key];
  };

  lecture.name = take('kcmc', parseText);
  lecture.grade.score = take('zcj', parseFloatOrText) || 0.0;
  lecture.grade.type = take('ksxzmc', parseText);
  lecture.gpa = lecture.grade.type === '正常考试' ? take('cjjd', parseFloatOrText) || 0.0 : 0.0;
  lecture.credit = take('xf', parseFloatOrText);

  return lecture;
};

Lecture.fromObjs = function (rows) {
  return rows.map(Lecture.fromObj);
};

// 从 `table` 中获取一系列课程信息
Lecture.fromRows = function (rows) {
  return $.map(rows, Lecture.fromTableRow);
};

function enlargeThreshold(change) {
  var bottomRow = document.getElementsByClassName('datagrid-pager')[0].children[0].children[0].rows[0];
  var select = bottomRow.cells[0].children[0];
  Array.prototype.forEach.call(select.options, function (option) {
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

var score = (function () {
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
  var rowCellsTmpl = ['<td class="credit-gpa" style="width: 50px; text-align: center;"></td>', '<td style="width: 50px; text-align: center;"><input type="checkbox" class="lecture-check" /></td>'];

  // 重新计算汇总成绩
  var renderSelected = function renderSelected() {
    var checkedRows = $('.lecture-check:checked').parent().parent();
    var lectures = Lecture.fromRows(checkedRows);

    $avgGPA.text('\u5E73\u5747\u7EE9\u70B9\uFF1A' + GPA.avgCreditGPA(lectures).toFixed(2));
    $avgScore.text('\u5E73\u5747\u5206\uFF1A' + GPA.avgScore(lectures).toFixed(2));
    $weightedAvgScore.text('\u52A0\u6743\u5E73\u5747\u5206\uFF1A' + GPA.avgWeightedScore(lectures).toFixed(2));
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
        var rows = scoreDatas.filter(function (x) {
          return x.xnxqdm.indexOf(from) === 0;
        });
        var lectures = Lecture.fromObjs(rows);
        var to = String(Number(from) + 1);
        $allYearAvgGPA.text('[' + from + '-' + to + '\u5B66\u5E74] \u5E73\u5747\u7EE9\u70B9\uFF1A' + GPA.avgCreditGPA(lectures).toFixed(2));
        $allYearAvgScore.text('\u5E73\u5747\u5206\uFF1A' + GPA.avgScore(lectures).toFixed(2));
        $allYearWeightedAvgScore.text('\u52A0\u6743\u5E73\u5747\u5206\uFF1A' + GPA.avgWeightedScore(lectures).toFixed(2));
      } else {
        $allYearAvgGPA.text('');
        $allYearAvgScore.text('');
        $allYearWeightedAvgScore.text('');
      }
    }
  }

  fetchScoreData(function (_ref) {
    var rows = _ref.rows;

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
      if ($target.is('.l-btn-text') || $target.is('.lecture-check')) return;
      var $checkbox = $(this).find('input.lecture-check');
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

var page = router();
page.on(/^xskccjxx!xskccjList\.action/, score);
page.on(/^xsgrkbcx!xskbList2\.action/, calendar(courseBlackList));
page.run();

}());
