"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const DISPLAY_TABS = [
  { label: "Bestsellers", value: "Bestsellers" },
  { label: "New Releases", value: "New-Releases" },
  { label: "Coming Soon", value: "Coming-Soon" },
];

const getCoverImage = (book) => {
  let src = book.thumbnailUrl || book.coverImageUrl || book.coverImage || "";
  if (Array.isArray(src)) src = src[0];
  if (typeof src !== "string") return "/images/book-placeholder.png";
  return src.split(",")[0].trim();
};

const getAuthorsWithLinks = (book) => {
  const authors = [];
  if (book.author?.name && book.author?.slug) {
    authors.push({ name: book.author.name, slug: book.author.slug });
  }
  if (Array.isArray(book.writers) && book.writers.length) {
    book.writers.forEach((w) => {
      if (w?.name && w?.slug) authors.push({ name: w.name, slug: w.slug });
    });
  }
  if (!authors.length && typeof book.author === "string") {
    authors.push({ name: book.author, slug: null });
  }
  return authors;
};

export default function BookDiscovery() {
  const sliderRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("Bestsellers");
  const [booksByCategory, setBooksByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  // 1. Define visibleBooks at the top level so it's ALWAYS defined
  const visibleBooks = useMemo(() => {
    return (booksByCategory[activeCategory] || []).slice(0, 15);
  }, [booksByCategory, activeCategory]);

  // Helper to wait for images to actually download
  const preloadImages = (books) => {
    const promises = books.map((book) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getCoverImage(book);
        img.onload = resolve;
        img.onerror = resolve; // Resolve anyway to avoid infinite loading on 404s
      });
    });
    return Promise.all(promises);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://dashboard.bluone.ink/api/v1/public/books-list", {
          cache: "no-store",
        });
        const data = await res.json();

        const categories = {
          Bestsellers: data.bestsellers || [],
          "New-Releases": data.newReleases || [],
          "Coming-Soon": data.comingSoon || [],
        };

        // Wait for the images of the first tab to load before showing anything
        if (categories["Bestsellers"].length > 0) {
          await preloadImages(categories["Bestsellers"].slice(0, 10));
        }

        setBooksByCategory(categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const scroll = (direction) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  return (
    <section className="container mx-auto mt-16 px-4">
      {/* Tabs */}
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

      <div className="relative min-h-[350px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Loading books...</p>
          </div>
        ) : (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hidden md:block"
            >
              <FaChevronLeft />
            </button>

            <div
              ref={sliderRef}
              className="flex overflow-x-auto scroll-smooth no-scrollbar gap-4 px-1 md:px-8"
            >
              {visibleBooks.length > 0 ? (
                visibleBooks.map((book) => {
                  const authors = getAuthorsWithLinks(book);
                  return (
                    <div
                      key={book.id}
                      className="shrink-0 w-[50%] sm:w-[33.333%] md:w-[25%] lg:w-[16.666%]"
                    >
                      <div className="w-full h-[300px]">
                        <Link href={`/books/${book.slug}`}>
                          <img
                            src={getCoverImage(book)}
                            alt={book.title}
                            className="w-full h-full object-contain shadow-md rounded"
                          />
                        </Link>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-center line-clamp-2">
                        <Link href={`/books/${book.slug}`} className="hover:underline font-medium hover:text-blue-600">
                          {book.title}
                        </Link>
                      </p>
                      {authors.length > 0 && (
                        <p className="text-[11px] text-gray-500 text-center">
                          {authors.map((a, index) => (
                            <span key={`${a.name}-${index}`}>
                              {a.slug ? (
                                <Link href={`/authors/${a.slug}`} className="hover:underline">
                                  {a.name}
                                </Link>
                              ) : (
                                <span>{a.name}</span>
                              )}
                              {index < authors.length - 1 && ", "}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-center w-full">No books found in this category.</p>
              )}
            </div>

            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hidden md:block"
            >
              <FaChevronRight />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
