/**
 * API utilities for fetching hero section data from BluOne Ink API
 */
import { getApiUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiUrl("/api/public");

/**
 * Fetches all active hero sections from the API
 * @returns {Promise<Array>} - Promise resolving to an array of hero section objects
 */
export async function fetchHeroSections() {
  try {
    const response = await fetch(`${API_BASE_URL}/hero-section`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch hero sections: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching hero sections:", error);
    throw error;
  }
}

/**
 * Process hero section data to extract image URLs and links
 * Filters for hero sections with mediaType "image" and returns their mediaUrl and link
 * @param {Array} heroSections - Array of hero section objects from API
 * @returns {Array} - Array of objects with image URL and optional link
 */
export function processHeroSectionImages(heroSections) {
  if (!Array.isArray(heroSections)) {
    return [];
  }

  // Filter for image type hero sections and extract mediaUrl and link
  const imageData = heroSections
    .filter(section => section.mediaType === "image" && section.mediaUrl)
    .sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort by order field
    .map(section => ({
      image: section.mediaUrl,
      link: section.link || null,
      title: section.title || null
    }));

  return imageData;
}
