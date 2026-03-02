import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [currentPage, setCurrentPage] = useState(1);

  const RESULTS_PER_PAGE = 50;

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://dashboard.bluone.ink/api/public/books?search=${encodeURIComponent(query)}`
        );
        if (res.ok) {
          const data = await res.json();

          const filtered = data.filter((book) => {
            const titleMatch = book.title?.toLowerCase().includes(query.toLowerCase());
            const authorMatch = book.author?.name?.toLowerCase().includes(query.toLowerCase());
            const isbnMatch = book.isbn?.toString().toLowerCase().includes(query.toLowerCase());
            return titleMatch || authorMatch || isbnMatch;
          });

          setResults(filtered);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchInput)}`);
    }
  };

  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  return (
    <div className="p-6 mt-12 mb-12">
      <div className="flex items-center mb-6 max-w-lg mx-auto">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search books by title, author, or ISBN..."
          className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-3 bg-[#241b6d] text-white rounded-r-md flex items-center justify-center hover:bg-[#1b1452]"
        >
          <FiSearch size={18} />
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Searching...</p>}
      {!loading && results.length === 0 && query && (
        <p className="text-center text-gray-500">No results found for "{query}"</p>
      )}

      <div className="grid container grid-cols-2 md:grid-cols-4 gap-6">
        {paginatedResults.map((book) => (
          <div
            key={book.id}
            className="border p-3 rounded-lg shadow hover:shadow-lg transition cursor-pointer bg-white"
            onClick={() => router.push(`/books/${book.slug}`)}
          >
            {book.thumbnailUrl ? (
              <img
                src={book.thumbnailUrl}
                alt={book.title}
                className="w-full md:h-96 object-cover rounded-md"
              />
            ) : book.coverImageUrl?.length > 0 ? (
              <img
                src={book.coverImageUrl[0]}
                alt={book.title}
                className="w-full h-48 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md">
                No Image
              </div>
            )}

            <h3 className="mt-3 font-medium text-sm line-clamp-2">{book.title}</h3>
            <p className="text-xs text-gray-600">{book.author?.name || "Unknown Author"}</p>
            {book.isbn && (
              <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
