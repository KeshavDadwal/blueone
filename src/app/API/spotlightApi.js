// API functions for fetching spotlight data
import { getApiUrl } from "@/lib/apiConfig";

const BASE_URL = getApiUrl("/api/public/spotlight");

/**
 * Fetch all active spotlights
 * @param {Object} filters - Optional filters (authorId, authorSlug, bookId, bookSlug, isActive)
 * @returns {Promise<Array>} Array of spotlight items
 */
export async function fetchSpotlights(filters = {}) {
  try {
    const params = new URLSearchParams();

    // Add filters to query params
    if (filters.authorId) params.append("authorId", filters.authorId);
    if (filters.authorSlug) params.append("authorSlug", filters.authorSlug);
    if (filters.bookId) params.append("bookId", filters.bookId);
    if (filters.bookSlug) params.append("bookSlug", filters.bookSlug);
    if (filters.isActive !== undefined) params.append("isActive", filters.isActive);

    const url = params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch spotlights: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching spotlights:", error);
    return [];
  }
}

/**
 * Extract YouTube video ID from various URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} YouTube video ID or null
 */
export function extractYouTubeId(url) {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Check if URL or content is video
 * @param {string} url - URL to check
 * @returns {boolean} True if video content
 */
function isVideoUrl(url) {
  if (!url) return false;
  const videoIndicators = ['youtube', 'youtu.be', 'vimeo', 'dailymotion', 'video', '.mp4', '.webm', '.ogg'];
  return videoIndicators.some(indicator => url.toLowerCase().includes(indicator));
}

/**
 * Process spotlight data for display
 * @param {Object} spotlight - Raw spotlight data
 * @returns {Object} Processed spotlight data
 */
export function processSpotlightData(spotlight) {
  const youtubeId = extractYouTubeId(spotlight.mediaUrl || spotlight.link);

  // Check if it's video content
  const isVideo = !!youtubeId ||
                  isVideoUrl(spotlight.mediaUrl) ||
                  isVideoUrl(spotlight.link);

  return {
    ...spotlight,
    youtubeId,
    thumbnailUrl: youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
      : spotlight.mediaUrl,
    isVideo
  };
}
