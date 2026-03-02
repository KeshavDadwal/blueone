"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Loader from "@/app/components/Loader";
import BooksCards from "../books/BooksCards";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

const ALLOWED_CATEGORIES = ["Fiction", "Non-Fiction", "Children"];

const LANGUAGE_PRIORITY = [
  "ENGLISH",
  "HINDI",
  "MALAYALAM",
  "TELUGU",
  "TAMIL",
  "KANNADA",
  "MARATHI",
  "ODIA",
  "BENGALI",
];

/* =========================
   NORMALIZE TITLE
========================= */
const normalizeTitle = (title = "") => {
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, "") // remove (Malayalam) etc
    .replace(/\s+/g, " ")
    .trim();
};

/* =========================
   PICK BEST LANGUAGE BOOK
========================= */
const pickPreferredLanguageBooks = (books = []) => {
  const map = {};

  books.forEach((book) => {
    // 🔴 STRONG GROUPING KEY
    const key = book.isbn13 || normalizeTitle(book.title);

    if (!map[key]) map[key] = [];
    map[key].push(book);
  });

  const result = [];

  Object.values(map).forEach((versions) => {
    const sorted = [...versions].sort((a, b) => {
      const aIndex = LANGUAGE_PRIORITY.indexOf(
        (a.language || "").toUpperCase()
      );
      const bIndex = LANGUAGE_PRIORITY.indexOf(
        (b.language || "").toUpperCase()
      );

      return (
        (aIndex === -1 ? 999 : aIndex) -
        (bIndex === -1 ? 999 : bIndex)
      );
    });

    // ✅ keep only the best language version
    result.push(sorted[0]);
  });

  return result;
};

/* =========================
   SCROLL BUTTONS
========================= */
const ScrollButtons = ({ onScrollLeft, onScrollRight }) => (
  <>
    <button
      onClick={onScrollLeft}
      className="absolute text-[20px] left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#f5f5f5] shadow p-2 rounded-full"
    >
      <MdOutlineKeyboardArrowLeft />
    </button>
    <button
      onClick={onScrollRight}
      className="absolute text-[20px] right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#f5f5f5] shadow p-2 rounded-full"
    >
      <MdOutlineKeyboardArrowRight />
    </button>
  </>
);

/* =========================
   BOOK CAROUSEL
========================= */
const BookCarousel = ({ category }) => {
  const scrollRef = useRef();
  const [sortOrder] = useState("desc");

  // 🔹 APPLY LANGUAGE FILTER HERE
  const preferredBooks = pickPreferredLanguageBooks(category.books || []);

  const books = [...preferredBooks]
    .sort((a, b) => (sortOrder === "desc" ? b.id - a.id : a.id - b.id))
    .slice(0, 10);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return books.length >= 1 ? (
    <div className="mb-12">
      <div className="mt-10 flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4 px-2">{category.name}</h2>
        {category.name !== "Top-Sellers" && (
          <Link
            href={{ pathname: "/books", query: { category: category.name } }}
            className="text-[#241b6d] underline inline-block"
          >
            More Books
          </Link>
        )}
      </div>

      <div className="relative">
        <ScrollButtons onScrollLeft={scrollLeft} onScrollRight={scrollRight} />
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar"
        >
          {books.map((book) => (
            <div
              key={book.id}
              className="p-4 min-w-[240px] max-w-[240px] shrink-0 hover:shadow-md input-border border-[#ffffff00] hover:border-[#BABABA] rounded-md"
            >
              <Link
                href={`/books/${book.slug}`}
                style={{ textDecoration: "none" }}
              >
                <BooksCards
                  title={book.title}
                  coverImage={book.thumbnailUrl}
                  bookPrice={`₹${book.price}`}
                  authorName={
                    book.author?.author_name ||
                    book.author?.name ||
                    (Array.isArray(book.author)
                      ? book.author.join(", ")
                      : book.author)
                  }
                  imageContainerClass="h-[280px] lg:h-[320px]"
                  slug={book.slug}
                  language={book.language}
                  format={
                    book.book_format === "PAPERBACK"
                      ? "PB"
                      : book.book_format === "HARDBACK"
                      ? "HB"
                      : book.book_format
                  }
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : null;
};

/* =========================
   MAIN PAGE
========================= */
export default function BooksPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const [catRes, bookRes] = await Promise.all([
          fetch("https://dashboard.bluone.ink/api/public/categories"),
          fetch("https://dashboard.bluone.ink/api/public/books"),
        ]);

        const data = await catRes.json();
        const allBooksList = await bookRes.json();

        // Map ISBN
        const isbnMap = {};
        allBooksList.forEach((book) => {
          if (book.id && book.isbn13) {
            isbnMap[book.id] = book.isbn13;
          }
        });

        // Collect all books
        const allBooks = [];
        data.forEach((cat) => {
          (cat.books || []).forEach((book) => {
            const isbn = isbnMap[book.id];
            if (isbn) book.slug = `${book.slug}-${isbn}`;
            allBooks.push(book);
          });
        });

        // Category map
        const categoryMap = {};
        data.forEach((cat) => {
          categoryMap[cat.id] = { ...cat, books: [...(cat.books || [])] };
        });

        // Add additional categories
        allBooks.forEach((book) => {
          (book.additionalCategories || []).forEach((catId) => {
            if (categoryMap[catId]) {
              if (!categoryMap[catId].books.some((b) => b.id === book.id)) {
                categoryMap[catId].books.push({
                  ...book,
                  slug: isbnMap[book.id]
                    ? `${book.slug.split("-")[0]}-${isbnMap[book.id]}`
                    : book.slug,
                });
              }
            }
          });
        });

        // let finalCategories = Object.values(categoryMap);
        let finalCategories = Object.values(categoryMap).filter((cat) =>
  ALLOWED_CATEGORIES.includes(cat.name)
);


        // Move Top Sellers to top
        // const topSellerIndex = finalCategories.findIndex(
        //   (cat) => cat.slug === "top-sellers"
        // );

        // if (topSellerIndex > -1) {
        //   const [topSellerCategory] = finalCategories.splice(topSellerIndex, 1);
        //   finalCategories = [topSellerCategory, ...finalCategories];
        // }

        setCategories(finalCategories);
      } catch (error) {
        console.error("Error fetching categories/books", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>All Books | BluOne Ink Publishing</title>
        <meta
          name="description"
          content="Fiction, Non-fiction, and Children books published in HARDCOVER, PAPERBACK, and eBook formats."
        />
        <link rel="canonical" href="https://www.bluone.ink/books" />
      </Helmet>

      <main className="top_bg_gradient">
        <div className="container mx-auto px-4 py-2">
          {loading ? (
            <Loader />
          ) : (
            categories
  .filter((cat) => ALLOWED_CATEGORIES.includes(cat.name))
  .map((category) => (
    <BookCarousel key={category.id} category={category} />
  ))

          )}
        </div>
      </main>
    </HelmetProvider>
  );
}
