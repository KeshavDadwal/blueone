/**
 * Utility functions for processing blog content
 */

/**
 * Process blog content to clean up HTML formatting
 * @param {string} content - The raw blog content
 * @returns {string} - Processed blog content
 */
export function processBlogContent(content) {
  if (!content) return '';
  
  try {
    return content
      .replace(/^"|"$/g, '') // Remove JSON quotes
      .replace(/^<p>|<\/p>$/g, '') // Remove opening and closing p tags at start/end
      .replace(/\\n/g, '') // Remove newline characters
      .replace(/\\\\/g, '\\') // Fix escaped backslashes
      .replace(/\\"/g, '"') // Fix escaped quotes
      .replace(/&lt;/g, '<') // Convert HTML entities
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .trim(); // Remove extra whitespace
  } catch (e) {
    console.warn("Error processing blog content:", e);
    return content;
  }
}

/**
 * Process blog metadata
 * @param {Object} blog - The blog data object
 * @returns {Object} - Processed blog data
 */
export function processBlogData(blog) {
  return {
    id: blog.id,
    title: blog.title,
    blogslug: blog.slug,
    content: processBlogContent(blog.content),
    blogbanner: blog.blogBanner,
    blogimage: blog.blogImage,
    categories: blog.categories || "",
    publishedDate: blog.date,
    meta_description: blog.metaDescription,
    author: blog.author ? blog.author.name : "No author",
  };
} 