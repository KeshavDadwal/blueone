const BOOKS_LIST_API_URL =
  "https://dashboard.bluone.ink/api/v1/public/books-list";

export async function fetchBooksByCategory() {
  try {
    const res = await fetch(BOOKS_LIST_API_URL, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to fetch books list: ${res.status}`);
    }

    const data = await res.json();

    return {
      "Bestsellers": data.bestsellers || [],
      "New-Releases": data.newReleases || [],
      "Coming-Soon": data.comingSoon || [],
    };
  } catch (error) {
    console.error("Error fetching books list:", error);
    return {
      "Bestsellers": [],
      "New-Releases": [],
      "Coming-Soon": [],
    };
  }
}

