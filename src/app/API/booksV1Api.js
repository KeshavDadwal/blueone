const DEFAULT_PORTAL_BASE_URL = "https://dashboard.bluone.ink";

function getPortalBaseUrl() {
  // Allow overriding via env if needed
  return process.env.NEXT_PUBLIC_PORTAL_BASE_URL || DEFAULT_PORTAL_BASE_URL;
}

async function fetchJson(url) {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchRelatedBooksV1({
  categorySlug,
  sort = "title_asc",
  page = 1,
  limit = 7,
}) {
  if (!categorySlug) return null;
  const base = getPortalBaseUrl();
  const url = `${base}/api/v1/public/books/related?category=${encodeURIComponent(
    categorySlug
  )}&sort=${encodeURIComponent(sort)}&page=${encodeURIComponent(
    page
  )}&limit=${encodeURIComponent(limit)}`;
  return fetchJson(url);
}

export async function fetchBookVersionsV1({ title }) {
  if (!title) return null;
  const base = getPortalBaseUrl();
  const url = `${base}/api/v1/public/books/versions?title=${encodeURIComponent(
    title
  )}`;
  return fetchJson(url);
}

