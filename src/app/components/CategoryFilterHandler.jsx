'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CategoryFilterHandler({
  setCategoryFilter,
  setShowFilters,
  books,
}) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');

  useEffect(() => {
    // If no category is specified, clear the filter
    if (!initialCategory) {
      setCategoryFilter([]);
      return;
    }

    if (initialCategory && books.length > 0) {
      // Decode the category parameter
      const decodedCategory = decodeURIComponent(initialCategory);
      
      // Find all unique categories from books
      const uniqueCategories = [...new Set(books.map(book => book.category).filter(Boolean))];
      
      // Find the best matching category
      const matchingCategory = uniqueCategories.find(cat => 
        cat && cat.toLowerCase().includes(decodedCategory.toLowerCase())
      );

      if (matchingCategory) {
        setCategoryFilter([matchingCategory]);
        setShowFilters(true);
      }
    }
  }, [initialCategory, books, setCategoryFilter, setShowFilters]);

  // This component doesn't render anything visible
  return null;
} 