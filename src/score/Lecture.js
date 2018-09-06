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
  this.code = null
  this.name = null
  this.type = null
  this.attribution = null
  this.credit = 0.0
  this.grade = {
    score: 0.0,
    type: null,
  }
  this.gpa = 0.0
}

const parseText = x => String(x).trim()

const parseFloatOrText = x => {
  const parsedText = parseText(x)
  const parsedFloat = parseFloat(parsedText)
  return Number.isNaN(parsedFloat) ? parsedText : parsedFloat
}

const parseText$ = x => parseText($(x).text())

const parseFloatOrText$ = x => {
  const parsedText = parseText$(x)
  const parsedFloat = parseFloat(parsedText)
  return Number.isNaN(parsedFloat) ? parsedText : parsedFloat
}

// 从 `table tr` 中获取一个课程信息
Lecture.fromTableRow = row => {
  const $cols = $('td', row)
  const lecture = new Lecture()
  const take = (idx, parser) => parser($cols[idx])

  lecture.code = take(3, parseText$)
  lecture.name = take(4, parseText$)
  lecture.grade.score = take(5, parseFloatOrText$) || 0.0
  lecture.grade.type = take(13, parseText$)
  lecture.gpa =
    lecture.grade.type === '正常考试' ? take(6, parseFloatOrText$) || 0.0 : 0.0
  lecture.credit = take(8, parseFloatOrText$)
  lecture.type = take(9, parseText$)
  lecture.attribution = take(10, parseText$)

  return lecture
}

Lecture.fromObj = row => {
  const lecture = new Lecture()
  const take = (key, parser) => (parser ? parser(row[key]) : row[key])

  lecture.name = take('kcmc', parseText)
  lecture.grade.score = take('zcj', parseFloatOrText) || 0.0
  lecture.grade.type = take('ksxzmc', parseText)
  lecture.gpa =
    lecture.grade.type === '正常考试'
      ? take('cjjd', parseFloatOrText) || 0.0
      : 0.0
  lecture.credit = take('xf', parseFloatOrText)

  return lecture
}

Lecture.fromObjs = rows => rows.map(Lecture.fromObj)

// 从 `table` 中获取一系列课程信息
Lecture.fromRows = rows => $.map(rows, Lecture.fromTableRow)

export default Lecture
