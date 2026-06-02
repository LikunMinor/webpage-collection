const assert = require("node:assert/strict");

const {
  filterSites,
  getVisibleTags,
  paginateSites,
} = require("../assets/app-logic.js");

const sites = [
  {
    title: "OpenRouter Models",
    url: "https://openrouter.ai/models",
    description: "Compare AI model pricing and context windows.",
    tags: ["AI", "API", "Model", "Compare", "Tool"],
  },
  {
    title: "DevDocs",
    url: "https://devdocs.io",
    description: "Fast API documentation lookup.",
    tags: ["Docs", "Frontend", "Reference"],
  },
  {
    title: "SVG Repo",
    url: "https://www.svgrepo.com",
    description: "Search downloadable SVG icons.",
    tags: ["Design", "Icon", "SVG"],
  },
];

assert.deepEqual(
  filterSites(sites, { query: "pricing", tags: [] }).map((site) => site.title),
  ["OpenRouter Models"],
  "搜索应该只匹配标题和描述",
);

assert.deepEqual(
  filterSites(sites, { query: "api", tags: ["Docs"] }).map((site) => site.title),
  ["DevDocs"],
  "搜索和标签筛选应该同时生效并取交集",
);

assert.deepEqual(
  filterSites(sites, { query: "svgrepo", tags: [] }).map((site) => site.title),
  [],
  "搜索不应该匹配网址",
);

assert.deepEqual(
  filterSites(sites, { query: "", tags: ["AI", "API"] }).map((site) => site.title),
  ["OpenRouter Models"],
  "选择多个标签时，站点必须同时包含所有已选标签",
);

assert.deepEqual(
  filterSites(sites, { query: "", tags: ["AI", "Docs"] }).map((site) => site.title),
  [],
  "选择多个标签时，不应该显示只命中部分标签的站点",
);

assert.deepEqual(
  getVisibleTags(sites[0]),
  ["AI", "API", "Model", "Compare"],
  "卡片只展示前四个标签",
);

assert.deepEqual(
  paginateSites(Array.from({ length: 45 }, (_, index) => ({ title: String(index) })), {
    page: 3,
    perPage: 20,
  }).items.map((site) => site.title),
  ["40", "41", "42", "43", "44"],
  "分页应该按数据文件顺序切片",
);

assert.equal(
  paginateSites(sites, { page: 1, perPage: "all" }).totalPages,
  1,
  "选择全部时应该只保留一页",
);
