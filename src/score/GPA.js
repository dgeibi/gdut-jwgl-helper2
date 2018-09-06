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
    if (score === '免修') return 95
    else if (score === '优秀') return 95
    else if (score === '良好') return 85
    else if (score === '中等') return 75
    else if (score === '及格') return 65
    else if (score === '不及格') return 0
    else if (score === '') {
      // 没有填写的情况当作 0 （出现在重修栏）
      return 0
    }
    return parseFloat(score)
  },

  // 计算一门课程的学分绩点
  //
  // 计算公式：
  //
  //      CreditGPA = Credit * GPA
  creditGPA(lecture) {
    return lecture.credit * lecture.gpa
  },

  // 计算若干门课程的总绩点
  sumCredit(lectures) {
    return lectures.reduce((sum, lecture) => sum + lecture.credit, 0)
  },

  // 计算若干门课程的平均分
  avgScore(lectures) {
    if (lectures.length === 0) {
      return 0
    }

    return (
      lectures.reduce(
        (sum, lecture) => sum + GPA.realScore(lecture.grade.score),
        0
      ) / lectures.length
    )
  },

  // 计算若干门课程的平均学分绩点
  avgCreditGPA(lectures) {
    if (lectures.length === 0) {
      return 0
    }

    const sumCreditGPA = lectures.reduce(
      (sum, lecture) => sum + GPA.creditGPA(lecture),
      0
    )

    return sumCreditGPA / GPA.sumCredit(lectures)
  },

  // 计算若干门课程的加权平均分
  avgWeightedScore(lectures) {
    if (lectures.length === 0) {
      return 0
    }

    const sumWeighedScore = lectures.reduce(
      (sum, lecture) =>
        lecture.credit * GPA.realScore(lecture.grade.score) + sum,
      0
    )

    return sumWeighedScore / GPA.sumCredit(lectures)
  },
}

export default GPA
