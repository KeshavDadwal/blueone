const CATEGORY_COUNTS_API_URL =
  "https://dashboard.bluone.ink/api/v1/public/books-list/count-by-category";

export async function fetchCategoryCounts() {
  try {
    const res = await fetch(CATEGORY_COUNTS_API_URL, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to fetch category counts: ${res.status}`);
    }

    const data = await res.json();
    return data || {};
  } catch (error) {
    console.error("Error fetching category counts:", error);
    return {};
  }
}

