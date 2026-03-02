'use client';

export const getAllAuthors = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `https://dashboard.bluone.ink/api/public/books/search?page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch authors');
    }

    const data = await response.json();
    
    // Extract unique authors from the books data
    const uniqueAuthors = [...new Set(data.data.map(book => ({
      id: book.author_id,
      name: book.author_name,
      slug: book.author_slug
    })))];

    return {
      authors: uniqueAuthors,
      total: uniqueAuthors.length,
      currentPage: page,
      totalPages: Math.ceil(uniqueAuthors.length / limit)
    };
  } catch (error) {
    console.error('Error fetching authors:', error);
    throw error;
  }
};

export default getAllAuthors; 