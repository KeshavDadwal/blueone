"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";
const DISPLAY_TABS = [
  { label: "Bestsellers", value: "Bestsellers" },
  { label: "New Releases", value: "New-Releases" },
  { label: "Coming Soon", value: "Coming-Soon" },
];

const getCoverImage = (book) => {
  let src =
    book.thumbnailUrl ||
    book.coverImageUrl ||
    book.coverImage ||
    "";

  if (Array.isArray(src)) src = src[0];
  if (typeof src !== "string") return "/images/book-placeholder.png";
  return src.split(",")[0].trim();
};

/* Author + Additional Writers with links */
const getAuthorsWithLinks = (book) => {
  const authors = [];

  // Main author
  if (book.author?.name && book.author?.slug) {
    authors.push({
      name: book.author.name,
      slug: book.author.slug,
    });
  }

  // Additional writers
  if (Array.isArray(book.writers) && book.writers.length) {
    book.writers.forEach((w) => {
      if (w?.name && w?.slug) {
        authors.push({
          name: w.name,
          slug: w.slug,
        });
      }
    });
  }

  // Fallback: author as string (no link possible)
  if (!authors.length && typeof book.author === "string") {
    authors.push({
      name: book.author,
      slug: null,
    });
  }

  return authors; 
};

export default function BookDiscovery() {
  const sliderRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("Bestsellers");
  const [booksByCategory, setBooksByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchBooks = async () => {
    try {
      setLoading(true);
 
      const res = await fetch(
        "https://dashboard.bluone.ink/api/v1/public/books-list",
        { cache: "no-store" }
      );
 
      const data = await res.json();
      setBooksByCategory({
        "Bestsellers": data.bestsellers || [],
        "New-Releases": data.newReleases || [],
        "Coming-Soon": data.comingSoon || [],
      });
 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  fetchBooks();
}, []);

  const visibleBooks = useMemo(() => {
    return (booksByCategory[activeCategory] || []).slice(0, 15);
  }, [booksByCategory, activeCategory]);

  const scroll = (direction) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  return (
    <section className="container mx-auto mt-16 px-4">
      <div className="flex gap-6 md:gap-20 border-b mb-8 overflow-x-auto no-scrollbar justify-start md:justify-center">
        {DISPLAY_TABS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveCategory(value)}
            className={`pb-3 whitespace-nowrap text-sm md:text-lg font-bold uppercase ${
              activeCategory === value
                ? "border-b-4 border-[#241B6D] text-[#241B6D]"
                : "text-gray-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="relative min-h-[240px]">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hidden md:block"
        >
          <FaChevronLeft />
        </button>

        {/* SLIDER ROW */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scroll-smooth no-scrollbar gap-4 px-1 md:px-8"
        >
          {loading ? (
            <p className="text-gray-400">Loading…</p>
          ) : visibleBooks.length ? (
            visibleBooks.map((book, index) => {
              const bookKey = book.slug || book.id || `book-${index}`;
              const authors = getAuthorsWithLinks(book);
              return (
                <div
                  key={bookKey}
                  className="shrink-0 w-[50%] sm:w-[33.333%] md:w-[25%] lg:w-[16.666%]"
                >
                  <div className="w-full h-[300px]">
                    <Link
                      href={`/books/${book.slug}`}
                      className="relative block w-full h-full"
                    >
                      <Image
                        src={getCoverImage(book)}
                        alt={book.title}
                        fill
                        sizes="(max-width: 640px) 150px, (max-width: 1024px) 300px, 400px"
                        className="object-contain shadow-md rounded"
                      />
                    </Link>
                  </div>

                  {/* Book title */}
                  <p className="mt-2 text-xs font-semibold text-center line-clamp-2">
                    <Link href={`/books/${book.slug}`} className="hover:underline font-medium hover:text-blue-600">{book.title}</Link>
                  </p>

                  {/* ✅ Clickable Authors */}
                  {authors.length > 0 && (
                    <p className="text-[11px] text-gray-500 text-center">
                      {authors.map((a, index) => {
                        const authorKey =
                          a.slug ||
                          a.name ||
                          `author-${bookKey}-${index}`;
                        return (
                        <span key={authorKey}>
                          {a.slug ? (
                            <Link
                              href={`/authors/${a.slug}`}
                              className="hover:underline font-medium hover:text-blue-600"
                            >
                              {a.name}
                            </Link>
                          ) : (
                            <span>{a.name}</span>
                          )}
                          {index < authors.length - 1 && ", "}
                        </span>
                      )})}
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-400">
              No books found in {activeCategory}
            </p>
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hidden md:block"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
}
