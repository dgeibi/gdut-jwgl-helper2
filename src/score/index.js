import GPA from './GPA'
import Lecture from './Lecture'

function enlargeThreshold(change) {
  const bottomRow = document.getElementsByClassName('datagrid-pager')[0]
    .children[0].children[0].rows[0]
  const select = bottomRow.cells[0].children[0]
  Array.prototype.forEach.call(select.options, option => {
    option.innerText = '1000'
  })
  select.value = '1000'
  if (change) $(select).change()
}

function fetchScoreData(callback) {
  return $.ajax({
    type: 'POST',
    url: 'xskccjxx!getDataList.action?miao',
    data: 'xnxqdm=&jhlxdm=&page=1&rows=1000&sort=xnxqdm&order=asc',
    dataType: 'json',
    success: callback,
  })
}

export default () => {
  enlargeThreshold(true)

  let scoreDatas = null

  // 页面元素
  const $infoRows = $('#tb table tbody')
  const $scoreTableHead = $('table.datagrid-htable tbody tr')

  $('#tb').height('auto')

  // 插入汇总栏: 平均绩点、平均分、加权平均分
  const $avgRow = $('<tr></tr>').appendTo($infoRows)
  const $avgGPA = $('<td></td>').appendTo($avgRow)
  const $avgScore = $('<td></td>').appendTo($avgRow)
  const $weightedAvgScore = $('<td></td>').appendTo($avgRow)

  const $allYearRow = $('<tr></tr>').appendTo($infoRows)
  const $allYearAvgGPA = $('<td></td>').appendTo($allYearRow)
  const $allYearAvgScore = $('<td></td>').appendTo($allYearRow)
  const $allYearWeightedAvgScore = $('<td></td>').appendTo($allYearRow)

  // 表头
  $('<td style="width: 50px; text-align: center;">学分绩点</td>').appendTo(
    $scoreTableHead
  )
  $(
    '<td style="width: 50px; text-align: center;">全选 <input type="checkbox" class="lecture-check-all" checked /></td>'
  ).appendTo($scoreTableHead)

  // 各行
  const rowCellsTmpl = [
    '<td class="credit-gpa" style="width: 50px; text-align: center;"></td>',
    '<td style="width: 50px; text-align: center;"><input type="checkbox" class="lecture-check" /></td>',
  ]

  // 重新计算汇总成绩
  const renderSelected = () => {
    const checkedRows = $('.lecture-check:checked')
      .parent()
      .parent()
    const lectures = Lecture.fromRows(checkedRows)

    $avgGPA.text(`平均绩点：${GPA.avgCreditGPA(lectures).toFixed(2)}`)
    $avgScore.text(`平均分：${GPA.avgScore(lectures).toFixed(2)}`)
    $weightedAvgScore.text(
      `加权平均分：${GPA.avgWeightedScore(lectures).toFixed(2)}`
    )
  }

  $('.lecture-check-all').change(() => {
    // 同步勾选状态
    $('.lecture-check').prop('checked', $('.lecture-check-all').is(':checked'))

    // 触发重新计算汇总栏
    renderSelected()
  })

  function renderAllYear() {
    if (scoreDatas) {
      const from = $('#xnxqdm')[0].value.slice(0, 4)
      if (from !== '') {
        const rows = scoreDatas.filter(x => x.xnxqdm.indexOf(from) === 0)
        const lectures = Lecture.fromObjs(rows)
        const to = String(Number(from) + 1)
        $allYearAvgGPA.text(
          `[${from}-${to}学年] 平均绩点：${GPA.avgCreditGPA(lectures).toFixed(
            2
          )}`
        )
        $allYearAvgScore.text(`平均分：${GPA.avgScore(lectures).toFixed(2)}`)
        $allYearWeightedAvgScore.text(
          `加权平均分：${GPA.avgWeightedScore(lectures).toFixed(2)}`
        )
      } else {
        $allYearAvgGPA.text('')
        $allYearAvgScore.text('')
        $allYearWeightedAvgScore.text('')
      }
    }
  }

  fetchScoreData(({ rows }) => {
    scoreDatas = rows
    renderAllYear()
  })

  function bindTable() {
    const $scoreRows = $('table.datagrid-btable tbody tr')

    // 课程信息
    const lectures = Lecture.fromRows($scoreRows)

    // 插入各行汇总栏: 学分绩点、是否加入计算
    $(rowCellsTmpl.join('')).appendTo($scoreRows)

    $scoreRows.each((i, row) => {
      const $row = $(row)
      const lecture = lectures[i]
      $row.find('.credit-gpa').text(GPA.creditGPA(lecture).toFixed(2))
    })

    // 绑定各栏的勾选事件
    $scoreRows.click(function clickRow(e) {
      const $target = $(e.target)
      if ($target.is('.l-btn-text') || $target.is('.lecture-check')) return
      const $checkbox = $(this).find('input.lecture-check')
      $checkbox.prop('checked', !$checkbox.prop('checked')).trigger('change')
    })

    $('.lecture-check').change(renderSelected)
    $('.lecture-check-all').trigger('change')
  }

  function afterLoad(event, xhr, settings) {
    if (settings.url !== 'xskccjxx!getDataList.action') return
    enlargeThreshold(false)
    bindTable()
    renderAllYear()
  }

  $(document).ajaxSuccess(afterLoad)
}
