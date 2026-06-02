const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");

assert.match(html, /收录站点/, "统计区应该用中文展示站点数量标签");
assert.match(html, /标签总数/, "统计区应该展示标签总数");
assert.doesNotMatch(html, /已选标签/, "统计区不应该展示已选标签数量");
assert.doesNotMatch(html, /COLLECTED SITES|ACTIVE TAGS/, "统计区不应该残留英文设计稿文案");
assert.doesNotMatch(html, /当前：|data-active-tag/, "标签区不应该展示当前筛选摘要");
assert.match(html, /data-tag-toggle/, "标签筛选区应该提供展开和收起全部标签的按钮");
