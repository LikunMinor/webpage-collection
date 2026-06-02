(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.WebpageCollectionLogic = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function filterSites(sites, state) {
    const query = normalize(state.query);
    const selectedTags = Array.isArray(state.tags)
      ? state.tags.map((tag) => String(tag || "").trim()).filter(Boolean)
      : String(state.tag || "").trim()
        ? [String(state.tag).trim()]
        : [];

    return sites.filter((site) => {
      const matchesQuery =
        query === "" ||
        normalize(site.title).includes(query) ||
        normalize(site.description).includes(query);
      const matchesTags = selectedTags.every((tag) => site.tags.includes(tag));

      return matchesQuery && matchesTags;
    });
  }

  function getVisibleTags(site) {
    return site.tags.slice(0, 4);
  }

  function paginateSites(sites, state) {
    if (state.perPage === "all") {
      return {
        items: sites,
        page: 1,
        totalPages: 1,
      };
    }

    const perPage = Number(state.perPage) || 20;
    const totalPages = Math.max(1, Math.ceil(sites.length / perPage));
    const page = Math.min(Math.max(Number(state.page) || 1, 1), totalPages);
    const start = (page - 1) * perPage;

    return {
      items: sites.slice(start, start + perPage),
      page,
      totalPages,
    };
  }

  return {
    filterSites,
    getVisibleTags,
    paginateSites,
  };
});
