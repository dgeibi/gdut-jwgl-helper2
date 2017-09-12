// https://github.com/vtmer/gdut-jwgl-helper
export default () => ({
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
        callbacks: [],
      };
    }
    this.routes[key].callbacks.push(callback);
    return this;
  },
  run(_url) {
    // 默认使用不带最开始 back slash 的 `location.pathname`
    const url = _url || window.location.pathname.slice(1);
    // 执行预先运行的回调函数组
    this.beforeRoutes.forEach((callback) => {
      callback();
    });

    // 检查是否有满足条件的回调函数
    let foundMatched = false;
    const self = this;
    Object.keys(this.routes).forEach((pattern) => {
      const route = self.routes[pattern];
      if (!route.regExp.test(url)) return;
      foundMatched = true;
      route.callbacks.forEach((callback) => {
        callback();
      });
    });
    return foundMatched;
  },
});
