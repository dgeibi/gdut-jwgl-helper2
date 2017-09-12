import GPA from './GPA';
import Lecture from './Lecture';

export default () => {
  // 页面元素
  const $infoRows = $('#tb table tbody');
  const $scoreTableHead = $('table.datagrid-htable tbody tr');

  $('#tb').height('auto');

  // 插入汇总栏: 平均绩点、平均分、加权平均分
  const $avgRow = $('<tr></tr>').appendTo($infoRows);
  const $avgGPA = $('<td class="avg-gpa" ></td>').appendTo($avgRow);
  const $avgScore = $('<td class="avg-score"></td>').appendTo($avgRow);
  const $weightedAvgScore = $('<td class="weighted-avg-score"></td>').appendTo($avgRow);

  // 表头
  $('<td style="width: 50px; text-align: center;">学分绩点</td>').appendTo($scoreTableHead);
  $('<td style="width: 50px; text-align: center;">全选 <input type="checkbox" class="lecture-check-all" checked /></td>').appendTo($scoreTableHead);

  // 各行
  const rowCellsTmpl = [
    '<td class="credit-gpa" style="width: 50px; text-align: center;"></td>',
    '<td style="width: 50px; text-align: center;"><input type="checkbox" class="lecture-check" /></td>',
  ];

  // 重新计算汇总成绩
  const renderSummarize = () => {
    const checkedRows = $('.lecture-check:checked')
      .parent()
      .parent();
    const lectures = Lecture.fromRows(checkedRows);

    $avgGPA.text(`平均绩点: ${GPA.avgCreditGPA(lectures).toFixed(2)}`);
    $avgScore.text(`平均分: ${GPA.avgScore(lectures).toFixed(2)}`);
    $weightedAvgScore.text(`加权平均分: ${GPA.avgWeightedScore(lectures).toFixed(2)}`);
  };

  $('.lecture-check-all').change(() => {
    // 同步勾选状态
    $('.lecture-check').prop('checked', $('.lecture-check-all').is(':checked'));

    // 触发重新计算汇总栏
    renderSummarize();
  });

  function afterLoad(event, xhr, settings) {
    if (settings.url !== 'xskccjxx!getDataList.action') return;
    const $scoreRows = $('table.datagrid-btable tbody tr');

    // 课程信息
    const lectures = Lecture.fromRows($scoreRows);

    // 插入各行汇总栏: 学分绩点、是否加入计算
    $(rowCellsTmpl.join('')).appendTo($scoreRows);

    $scoreRows.each((i, row) => {
      const $row = $(row);
      const lecture = lectures[i];
      $row.find('.credit-gpa').text(GPA.creditGPA(lecture).toFixed(2));
    });

    // 绑定各栏的勾选事件
    $scoreRows.click(function clickRow(e) {
      const $target = $(e.target);
      if ($target.is('.l-btn-text') || $target.is('.lecture-check')) return;
      const $checkbox = $(this).find('input.lecture-check');
      $checkbox.prop('checked', !$checkbox.prop('checked')).trigger('change');
    });

    $('.lecture-check').change(renderSummarize);
    $('.lecture-check-all').trigger('change');
  }
  $(document).ajaxSuccess(afterLoad);
};
