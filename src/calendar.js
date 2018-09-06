import fileSaver from 'file-saver'

const courseTimes = [
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
  { start: '20:10', end: '20:55' },
]

// getTime("2017-03-09","08:30") => "20170309T003000Z"
function getTime(dateStr, timeStr) {
  const date = new Date(`${dateStr}T${timeStr}:00+08:00`)
  return date
    .toISOString()
    .replace(/\.\d\d\d/, '')
    .replace(/[-:]/g, '')
}

function exportICS(courseBlackList) {
  const table = document.querySelector('.datagrid-body .datagrid-btable')
  const filename = `course${Date.now()}.ics`
  let ics =
    'BEGIN:VCALENDAR\n' +
    'PRODID:-//dgeibi/gdut-jwgl-helper//Calendar 1.0//EN\n' +
    'VERSION:2.0\n' +
    'CALSCALE:GREGORIAN\n' +
    'METHOD:PUBLISH\n' +
    'X-WR-CALNAME:课程表\n' +
    'X-WR-TIMEZONE:Asia/Shanghai\n'
  ;[].forEach.call(table.rows, row => {
    const { cells } = row
    const date = cells[8].firstChild.innerText
    const orderRaw = cells[6].firstChild.innerText
    const startOrder = orderRaw.slice(0, 2) - 1
    const endOrder = orderRaw.slice(-2) - 1
    const courseStartTime = courseTimes[startOrder].start
    const courseEndTime = courseTimes[endOrder].end
    const location = cells[7].firstChild.innerText
    const courseName = cells[0].firstChild.innerText
    const weekCount = cells[4].firstChild.innerText
    const teacher = cells[3].firstChild.innerText

    if (courseBlackList.indexOf(courseName) >= 0) return
    ics += 'BEGIN:VEVENT\n'
    ics += `DTSTART:${getTime(date, courseStartTime)}\n`
    ics += `DTEND:${getTime(date, courseEndTime)}\n`
    ics += `LOCATION:${location}\n`
    ics += `SUMMARY:${courseName}\n`
    ics += `${'DESCRIPTION:第'}${weekCount}周\\n${teacher}\n`
    ics += 'END:VEVENT\n'
  })
  ics += 'END:VCALENDAR\n'
  fileSaver.saveAs(new Blob([ics]), filename)
}

export default courseBlackList => () => {
  const bottomRow = document.getElementsByClassName('datagrid-pager')[0]
    .children[0].children[0].rows[0]
  const select = bottomRow.cells[0].children[0]
  ;[].forEach.call(select.options, option => {
    option.innerText = '1000'
  })

  // click Refresh Button
  bottomRow.cells[12].children[0].click()

  // create Export Button
  const exportBtn = document.createElement('button')
  exportBtn.type = 'button'
  exportBtn.style.cursor = 'pointer'
  exportBtn.innerText = '导出课表'
  exportBtn.onclick = () => {
    exportICS(courseBlackList)
  }

  // append Export Button
  const cell = document.createElement('td')
  cell.align = 'right'
  cell.appendChild(exportBtn)
  const topRow = document.getElementById('ff').children[0].rows[0]
  topRow.insertAdjacentElement('afterbegin', cell)
}
