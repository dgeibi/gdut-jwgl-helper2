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

const parseText = x =>
  $(x)
    .text()
    .trim();

const parseFloatOrText = (x) => {
  const parsedText = parseText(x);
  const parsedFloat = parseFloat(parsedText);
  return isNaN(parsedFloat) ? parsedText : parsedFloat;
};

// 从 `table tr` 中获取一个课程信息
Lecture.fromTableRow = (row) => {
  const $cols = $('td', row);
  const lecture = new Lecture();
  const takeFromRows = (idx, parser) => parser($cols[idx]);

  lecture.code = takeFromRows(3, parseText);
  lecture.name = takeFromRows(4, parseText);
  lecture.grade.score = takeFromRows(5, parseFloatOrText) || 0.0;
  lecture.grade.type = takeFromRows(13, parseText);
  lecture.gpa = lecture.grade.type === '正常考试' ? takeFromRows(6, parseFloatOrText) || 0.0 : 0.0;
  lecture.credit = takeFromRows(8, parseFloatOrText);
  lecture.type = takeFromRows(9, parseText);
  lecture.attribution = takeFromRows(10, parseText);

  return lecture;
};

// 从 `table` 中获取一系列课程信息
Lecture.fromRows = rows => $.map(rows, Lecture.fromTableRow);

export default Lecture;
