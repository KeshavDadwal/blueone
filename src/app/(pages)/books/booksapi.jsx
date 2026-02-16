'use client';

import { useState, useEffect } from 'react';
import { fetchAllBooks, fetchBookBySlug, processBookData } from '@/app/API/booksapi';
import Loader from '@/app/components/Loader';

/**
 * Example component that demonstrates how to use the Books API
 */
export default function BooksApiExample() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all books on component mount
  useEffect(() => {
    async function loadBooks() {
      try {
        setLoading(true);
        const booksData = await fetchAllBooks();
        
        // Process each book to ensure consistent format
        const processedBooks = booksData.map(book => processBookData(book));
        setBooks(processedBooks);
        setError(null);
      } catch (err) {
        setError('Failed to load books. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  // Function to load a specific book by slug
  const loadBookDetails = async (slug) => {
    try {
      setLoading(true);
      const bookData = await fetchBookBySlug(slug);
      const processedBook = processBookData(bookData);
      setSelectedBook(processedBook);
      setError(null);
    } catch (err) {
      setError(`Failed to load details for book "${slug}". Please try again later.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset selected book
  const clearSelectedBook = () => {
    setSelectedBook(null);
  };

  // Display loading state
  if (loading && !books.length) {
    return <Loader />;
  }

  // Display error state
  if (error && !books.length) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {selectedBook ? (
        // Display selected book details
        <div className="mb-8">
          <button
            onClick={clearSelectedBook}
            className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            ← Back to All Books
          </button>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book Cover */}
            <div className="w-full md:w-1/3">
              <img
                src={selectedBook.book_image}
                alt={selectedBook.title}
                className="w-full h-auto object-cover rounded-md shadow-md"
              />
              
              {/* Price and Buy buttons */}
              <div className="mt-4">
                <p className="text-xl font-bold mb-2">₹{selectedBook.price}</p>
                <div className="flex gap-2">
                  {selectedBook.amazonlink && (
                    <a
                      href={selectedBook.amazonlink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Buy on Amazon
                    </a>
                  )}
                  {selectedBook.flipkartlink && (
                    <a
                      href={selectedBook.flipkartlink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                    >
                      Buy on Flipkart
                    </a>
                  )}

                  {selectedBook.bookswagonLink && (
                    <a
                      href={selectedBook.bookswagonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                    >
                      Buy on Bookswagon
                    </a>
                  )}

                  {selectedBook.sapnaBooksLink && (
                    <a
                      href={selectedBook.sapnaBooksLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                    >
                      Buy on Sapna Books
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            {/* Book Details */}
            <div className="w-full md:w-2/3">
              <h1 className="text-3xl font-bold mb-2">{selectedBook.title}</h1>
              
              {/* Author */}
              {selectedBook.author && (
                <div className="mb-4">
                  <p className="text-xl text-gray-700">
                    By {selectedBook.author.author_name}
                  </p>
                </div>
              )}
              
              {/* Book Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-500">Format</p>
                  <p>{selectedBook.book_format}</p>
                </div>
                <div>
                  <p className="text-gray-500">Language</p>
                  <p>{selectedBook.language}</p>
                </div>
                <div>
                  <p className="text-gray-500">Publication Year</p>
                  <p>{selectedBook.publish_year}</p>
                </div>
                <div>
                  <p className="text-gray-500">Pages</p>
                  <p>{selectedBook.pages}</p>
                </div>
                <div>
                  <p className="text-gray-500">ISBN-13</p>
                  <p>{selectedBook.isbn13}</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p>{selectedBook.category}</p>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Description</h2>
                <div dangerouslySetInnerHTML={{ __html: selectedBook.about_book }} />
              </div>
              
              {/* Testimonials */}
              {selectedBook.testimonials && selectedBook.testimonials.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-2">Testimonials</h2>
                  <div className="space-y-4">
                    {selectedBook.testimonials.map((testimonial, index) => (
                      <div key={index} className="italic border-l-4 border-gray-300 pl-4">
                        <p>{testimonial.quote}</p>
                        <p className="font-bold mt-2">- {testimonial.name}</p>
                        {testimonial.designation && (
                          <p className="text-sm text-gray-600">{testimonial.designation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Display book list
        <div>
          <h1 className="text-3xl font-bold mb-6">All Books</h1>
          
          {/* Books Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <div key={book.id} className="cursor-pointer hover:shadow-lg transition-shadow rounded-md overflow-hidden border border-gray-200">
                <div onClick={() => loadBookDetails(book.slug)}>
                  <img
                    src={book.book_image}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="font-bold text-lg mb-1 line-clamp-2">{book.title}</h2>
                    <p className="text-gray-600 mb-2">
                      {book.author?.author_name || 'Unknown Author'}
                    </p>
                    <p className="font-bold">₹{book.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}