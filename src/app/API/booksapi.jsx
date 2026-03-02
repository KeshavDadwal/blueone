/**
 * API utilities for fetching book data from BluOne Ink API
 */

const API_BASE_URL = "https://dashboard.bluone.ink/api/public";

/**
 * Fetches all books from the API
 * @returns {Promise<Array>} - Promise resolving to an array of book objects
 */
export async function fetchAllBooks() {
  try {
    const response = await fetch(`${API_BASE_URL}/books`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

/**
 * Fetches a specific book by its slug
 * @param {string} slug - The book's slug identifier
 * @returns {Promise<Object>} - Promise resolving to a book object
 */
export async function fetchBookBySlug(slug) {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${slug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch book: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching book with slug "${slug}":`, error);
    throw error;
  }
}

/**
 * Process the book data to ensure consistent format
 * @param {Object} book - The book data from API
 * @returns {Object} - Processed book data
 */
export function processBookData(book) {
  // Parse JSON strings to objects if needed
  let coverImages = [];
  try {
    if (typeof book.coverImageUrl === 'string') {
      // Split the string by comma and trim each URL
      coverImages = book.coverImageUrl.split(',').map(url => url.trim());
    } else if (Array.isArray(book.coverImageUrl)) {
      coverImages = book.coverImageUrl;
    }
  } catch (e) {
    console.warn("Error parsing coverImageUrl:", e);
  }

  let authorSocial = {};
  try {
    if (book.author?.socialMedia && typeof book.author.socialMedia === 'string') {
      authorSocial = JSON.parse(book.author.socialMedia);
    } else if (typeof book.author?.socialMedia === 'object') {
      authorSocial = book.author.socialMedia;
    }
  } catch (e) {
    console.warn("Error parsing author social media:", e);
  }

  let endorsements = [];
  try {
    if (book.endorsements && typeof book.endorsements === 'string') {
      endorsements = JSON.parse(book.endorsements);
    } else if (Array.isArray(book.endorsements)) {
      endorsements = book.endorsements;
    }
    // Map the endorsement data to match the expected structure
    endorsements = endorsements.map(endorsement => ({
      quote: endorsement.text,
      name: endorsement.personName,
      designation: endorsement.designation
    }));
  } catch (e) {
    console.warn("Error parsing endorsements:", e);
  }

  let spotlight = [];
  try {
    if (book.spotlight && typeof book.spotlight === 'string') {
      // Parse the JSON string and process each media item
      spotlight = JSON.parse(book.spotlight).map(media => ({
        title: media.title || '',
        description: media.description || '',
        type: media.type || (media.videoUrl ? 'video' : 'image'),
        videoUrl: media.videoUrl?.replace(/[\[\]"]/g, '').trim() || '',
        imageUrl: media.imageUrl?.replace(/[\[\]"]/g, '').trim() || '',
        thumbnailUrl: media.thumbnailUrl?.replace(/[\[\]"]/g, '').trim() || ''
      }));
    } else if (Array.isArray(book.spotlight)) {
      spotlight = book.spotlight.map(media => ({
        title: media.title || '',
        description: media.description || '',
        type: media.type || (media.videoUrl ? 'video' : 'image'),
        videoUrl: media.videoUrl?.replace(/[\[\]"]/g, '').trim() || '',
        imageUrl: media.imageUrl?.replace(/[\[\]"]/g, '').trim() || '',
        thumbnailUrl: media.thumbnailUrl?.replace(/[\[\]"]/g, '').trim() || ''
      }));
    }
  } catch (e) {
    console.warn("Error parsing spotlight:", e);
  }

  let relatedBooks = [];
  try {
    if (book.relatedBooks && typeof book.relatedBooks === 'string') {
      relatedBooks = JSON.parse(book.relatedBooks);
    } else if (Array.isArray(book.relatedBooks)) {
      relatedBooks = book.relatedBooks;
    }
  } catch (e) {
    console.warn("Error parsing relatedBooks:", e);
  }

  let pressCoverage = "";
  try {
    if (book.pressCoverage && typeof book.pressCoverage === 'string') {
      // Clean up the HTML content
      pressCoverage = book.pressCoverage
        .replace(/^"|"$/g, '') // Remove JSON quotes
        .replace(/^<p>|<\/p>$/g, '') // Remove opening and closing p tags at start/end
        .replace(/<p>|<\/p>/g, '') // Remove p tags
        .replace(/\\n/g, '') // Remove newline characters
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/\\\\"/g, '\\"') // Fix double escaped quotes
        .trim(); // Remove any extra whitespace
    } else if (typeof book.pressCoverage === 'object') {
      pressCoverage = book.pressCoverage;
    }
  } catch (e) {
    console.warn("Error parsing press coverage:", e);
  }

  // Combine author and writer names
  const allAuthorNames = [
    book.author?.name,
    ...(book.writers || []).map(writer => writer.name)
  ].filter(Boolean).join(', ');

  // Process A+ Content
  let aPlusContent = [];
  try {
    if (book.aPlusContent) {
      if (typeof book.aPlusContent === 'string') {
        aPlusContent = JSON.parse(book.aPlusContent);
      } else if (Array.isArray(book.aPlusContent)) {
        aPlusContent = book.aPlusContent;
      }
    }
  } catch (e) {
    console.warn("Error parsing aPlusContent:", e);
  }

  // Return processed book data
  return {
    id: book.id,
    title: book.title,
    slug: book.slug,
    book_image: book.thumbnailUrl, // Use thumbnailUrl for the main book image
    book_thumbnail: coverImages, // Use coverImageUrl array for thumbnails
    publish_year: book.publishYear,
    publish_month: book.publishMonth,
    price: book.price,
    book_format: book.format,
    dimension: book.dimension,
    pages: book.pages,
    weight: book.weight,
    isbn13: book.isbn13,
    about_book: book.description,
    meta_title: book.metaTitle,
    meta_description: book.metaDescription,
    meta_keywords: book.metaKeywords,
    amazonlink: book.amazonLink,
    amazon_comlink: book.amazonComLink,
    flipkartlink: book.flipkartLink,
    bookswagonLink: book.bookswagonLink,
    sapnaBooksLink: book.sapnaBooksLink,
    testimonials: endorsements,
    pressCoverage: pressCoverage,
    spotlight: spotlight,
    preorder: book.preorderLink,
    downloadaisheet: book.aiSheetUrl,
    relatedBooks: relatedBooks,
    language: book.language,
    aPlusContent: aPlusContent, // Add A+ Content
    author: book.author ? {
      id: book.author.id,
      authslug: book.author.slug,
      author_name: book.author.name,
      image: book.author.imageUrl,
      authorDescription: book.author.description,
      authorSocial: authorSocial
    } : null,
    authors: [
      book.author,
      ...(book.writers || [])
    ].filter(Boolean).map(author => ({
      id: author.id,
      author_name: author.name,
      authslug: author.slug,
      image: author.imageUrl,
      authorDescription: author.description,
      authorSocial: author.socialMedia ? 
        (typeof author.socialMedia === 'string' ? JSON.parse(author.socialMedia) : author.socialMedia) 
        : {}
    })), // Add all authors (author + writers)
    authorNames: allAuthorNames, // Add combined author names
    category: book.category?.name,
    genre: book.genre?.name
  };
}

/**
 * Hook for fetching books with client-side caching
 * @returns {Object} - Object containing fetch functions and loading states
 */
export function useBooksApi() {
  // This hook could be expanded to include React state and caching logic
  return {
    getAllBooks: fetchAllBooks,
    getBookBySlug: fetchBookBySlug,
    processBookData
  };
}