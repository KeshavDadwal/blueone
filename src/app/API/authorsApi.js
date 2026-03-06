// API functions for fetching authors data

const BASE_URL = "https://dashboard.bluone.ink/api/public/authors";
const BASE_URL1 = "https://dashboard.bluone.ink/api/v1/public/authors";

/**
 * Fetch all authors
 * @returns {Promise<Array>} Array of author objects
 */
export async function fetchAuthors() {
  try {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch authors: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}

/**
 * Fetch authors with spotlight data
 * @returns {Promise<Array>} Array of authors who have spotlight content
 */
export async function fetchAuthorsWithSpotlight() {
  try {
    const authors = await fetchAuthors();
    // Filter authors that have spotlight data
    const authorsWithSpotlight = authors.filter(
      author => author.spotlight && author.spotlight.length > 0
    );
    return authorsWithSpotlight;
  } catch (error) {
    console.error("Error fetching authors with spotlight:", error);
    return [];
  }
}

/**
 * Fetch a single author by slug
 * @param {string} slug - Author slug
 * @returns {Promise<Object|null>} Author object or null
 */
export async function fetchAuthorBySlug(slug) {
  try {
    const response = await fetch(`${BASE_URL}/${slug}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch author: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching author:", error);
    return null;
  }
}

export async function fetchAuthorsBySlugs(slugs) {
  try {
    const slugString = Array.isArray(slugs) ? slugs.join(",") : slugs;

    const response = await fetch(`${BASE_URL1}?slugs=${slugString}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch authors: ${response.statusText}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}

/**
 * Truncate text to a specific length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 200) {
  if (!text) return "";

  // Remove HTML tags if present
  const strippedText = text.replace(/<[^>]*>/g, '');

  if (strippedText.length <= maxLength) return strippedText;

  // Find the last space before maxLength to avoid cutting words
  const truncated = strippedText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + "...";
  }

  return truncated + "...";
}

/**
 * Process author data for display
 * @param {Object} author - Raw author data
 * @returns {Object} Processed author data
 */
export function processAuthorData(author) {
  // Parse socialMedia if it's a string (JSON)
  let socialMediaObj = {};
  try {
    if (author.socialMedia) {
      if (typeof author.socialMedia === 'string') {
        socialMediaObj = JSON.parse(author.socialMedia);
      } else if (typeof author.socialMedia === 'object') {
        socialMediaObj = author.socialMedia;
      }
    }
  } catch (e) {
    console.warn("Error parsing author socialMedia:", e);
  }

  // Extract social media links - check both object keys and values
  const socialLinks = {
    instagram: socialMediaObj.instagram || socialMediaObj.Instagram || null,
    linkedin: socialMediaObj.linkedin || socialMediaObj.LinkedIn || null,
    twitter: socialMediaObj.twitter || socialMediaObj.Twitter || socialMediaObj.x || socialMediaObj.X || null,
    facebook: socialMediaObj.facebook || socialMediaObj.Facebook || null,
    youtube: socialMediaObj.youtube || socialMediaObj.YouTube || null,
    website: socialMediaObj.website || socialMediaObj.Website || null
  };

  // Also check if socialMedia is an array of URLs
  if (Object.keys(socialLinks).every(key => !socialLinks[key])) {
    const socialMediaArray = Object.values(socialMediaObj);
    socialLinks.instagram = socialMediaArray.find(url => url && url.includes('instagram')) || null;
    socialLinks.linkedin = socialMediaArray.find(url => url && url.includes('linkedin')) || null;
    socialLinks.twitter = socialMediaArray.find(url => url && (url.includes('twitter') || url.includes('x.com'))) || null;
    socialLinks.facebook = socialMediaArray.find(url => url && url.includes('facebook')) || null;
    socialLinks.youtube = socialMediaArray.find(url => url && url.includes('youtube')) || null;
    socialLinks.website = socialMediaArray.find(url => url && !url.includes('instagram') && !url.includes('linkedin') && !url.includes('twitter') && !url.includes('x.com') && !url.includes('facebook') && !url.includes('youtube')) || null;
  }

  // Check multiple possible fields for description
  const description = author.description ||
                     author.bio ||
                     author.about ||
                     author.biography ||
                     author.authorBio ||
                     author.authorDescription ||
                     author.profile ||
                     author.summary ||
                     "";

  return {
    ...author,
    name: author.name || author.author_name,
    description: description, // Preserve full description
    truncatedDescription: truncateText(description, 200),
    imageUrl: author.imageUrl || author.image || author.profileImage || "/author-defaultimages.png",
    socialLinks,
    socialMediaArray: Object.values(socialMediaObj)
  };
}
