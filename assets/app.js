const logic = window.WebpageCollectionLogic;
const state = {
  query: "",
  tags: [],
  page: 1,
  perPage: 20,
};

const els = {
  search: document.querySelector("[data-search]"),
  perPage: document.querySelector("[data-per-page]"),
  clear: document.querySelector("[data-clear]"),
  count: document.querySelector("[data-count]"),
  list: document.querySelector("[data-list]"),
  pagination: document.querySelector("[data-pagination]"),
  tagCloud: document.querySelector("[data-tag-cloud]"),
  tagToggle: document.querySelector("[data-tag-toggle]"),
  totalSites: document.querySelector("[data-total-sites]"),
  totalTags: document.querySelector("[data-total-tags]"),
};

function uniqueTags() {
  return [...new Set(window.SITES.flatMap((site) => site.tags))];
}

function setTag(tag) {
  if (state.tags.includes(tag)) {
    state.tags = state.tags.filter((selectedTag) => selectedTag !== tag);
  } else {
    state.tags = [...state.tags, tag];
  }
  state.page = 1;
  render();
}

function createTagButton(tag, active) {
  const button = document.createElement("button");
  button.className = active ? "tag tag-active" : "tag";
  button.setAttribute("aria-pressed", active ? "true" : "false");
  button.type = "button";
  button.textContent = tag;
  button.addEventListener("click", () => setTag(tag));
  return button;
}

function renderTagCloud() {
  els.tagCloud.innerHTML = "";
  uniqueTags().forEach((tag) => {
    els.tagCloud.appendChild(createTagButton(tag, state.tags.includes(tag)));
  });
}

function renderCard(site) {
  const article = document.createElement("article");
  article.className = "site-card";

  const main = document.createElement("div");
  main.className = "site-main";

  const title = document.createElement("a");
  title.className = "site-title";
  title.href = site.url;
  title.target = "_blank";
  title.rel = "noreferrer";
  title.textContent = site.title;

  const url = document.createElement("p");
  url.className = "site-url";
  url.textContent = site.url;

  const desc = document.createElement("p");
  desc.className = "site-description";
  desc.textContent = site.description;

  const tags = document.createElement("div");
  tags.className = "site-tags";
  logic.getVisibleTags(site).forEach((tag) => {
    tags.appendChild(createTagButton(tag, state.tags.includes(tag)));
  });

  main.append(title, url, desc);
  article.append(main, tags);
  return article;
}

function renderPagination(page, totalPages) {
  els.pagination.innerHTML = "";
  if (state.perPage === "all") return;

  const prev = document.createElement("button");
  prev.className = "page-button";
  prev.type = "button";
  prev.textContent = "上一页";
  prev.disabled = page <= 1;
  prev.addEventListener("click", () => {
    state.page -= 1;
    render();
  });

  const summary = document.createElement("span");
  summary.className = "page-summary";
  summary.textContent = `${page} / ${totalPages}`;

  const next = document.createElement("button");
  next.className = "page-button";
  next.type = "button";
  next.textContent = "下一页";
  next.disabled = page >= totalPages;
  next.addEventListener("click", () => {
    state.page += 1;
    render();
  });

  els.pagination.append(prev, summary, next);
}

function render() {
  const filtered = logic.filterSites(window.SITES, state);
  const pageData = logic.paginateSites(filtered, state);
  state.page = pageData.page;

  els.totalSites.textContent = String(window.SITES.length);
  els.totalTags.textContent = String(uniqueTags().length);
  els.count.textContent = `显示 ${pageData.items.length} / 共 ${filtered.length} 个站点`;
  els.list.innerHTML = "";

  if (pageData.items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "没有找到匹配的站点。";
    els.list.appendChild(empty);
  } else {
    pageData.items.forEach((site) => els.list.appendChild(renderCard(site)));
  }

  renderTagCloud();
  renderPagination(pageData.page, pageData.totalPages);
}

els.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  state.page = 1;
  render();
});

els.perPage.addEventListener("change", (event) => {
  state.perPage = event.target.value === "all" ? "all" : Number(event.target.value);
  state.page = 1;
  render();
});

els.clear.addEventListener("click", () => {
  state.query = "";
  state.tags = [];
  state.page = 1;
  els.search.value = "";
  render();
});

els.tagToggle.addEventListener("click", () => {
  const expanded = els.tagToggle.getAttribute("aria-expanded") === "true";
  els.tagToggle.setAttribute("aria-expanded", expanded ? "false" : "true");
  els.tagToggle.textContent = expanded ? "展开标签" : "收起标签";
  els.tagCloud.classList.toggle("tag-cloud-collapsed", expanded);
});

render();
