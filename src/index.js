import router from './router'
import calendar from './calendar'
import score from './score'

const page = router()
page.on(/^xskccjxx!xskccjList\.action/, score)
page.on(/^xsgrkbcx!xskbList2\.action/, calendar(courseBlackList))
page.run()
