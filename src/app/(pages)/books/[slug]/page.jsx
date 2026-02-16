"use client";
import { useEffect, useState } from "react";
import { fetchBookBySlug, processBookData } from "@/app/API/booksapi";
import { getAllAuthors } from "@/app/API/allAuthorList";
import Image from "next/image";
import Link from "next/link";
import inkdouble1 from "@/app/assests/image/inkdouble1.svg";
import inkdouble2 from "@/app/assests/image/inkdouble2.svg";
import { RiArrowRightSLine } from "react-icons/ri";
import BooksCards from "../BooksCards";
import SliderBook from "@/app/components/SliderBook";
import Loader from "@/app/components/Loader";
import Spotlight from "@/app/components/Spotlight";
import CurveTop from "@/app/assests/image/aboutauthorbg.png";
import { HelmetProvider, Helmet } from "react-helmet-async";
import ScriptLoader from "@/app/ScriptLoader";
import { useRouter } from "next/navigation";
import AddToAnyShare from "@/app/components/ImagePreviewSection";
import { getApiUrl } from "@/lib/apiConfig";

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

const normalizeTitle = (title = "") =>
  title
    .toLowerCase()
    .replace(/\(.*?\)/g, "")   // remove (Malayalam)
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const normalizeLanguage = (lang = "") =>
  lang.toString().trim().toUpperCase();

const dedupeRelatedByLanguagePriority = (books = []) => {
  const map = {};

  books.forEach((book) => {
    const key = normalizeTitle(book.title);
    if (!key) return;

    if (!map[key]) map[key] = [];
    map[key].push(book);
  });

  const result = [];

  Object.values(map).forEach((versions) => {
    if (!versions.length) return;

    const sorted = [...versions].sort((a, b) => {
      const aIndex = LANGUAGE_PRIORITY.indexOf(
        normalizeLanguage(a.language)
      );
      const bIndex = LANGUAGE_PRIORITY.indexOf(
        normalizeLanguage(b.language)
      );

      return (aIndex === -1 ? 999 : aIndex) -
             (bIndex === -1 ? 999 : bIndex);
    });
    result.push(sorted[0]);
  });

  return result;
};

const Page = ({ params }) => {
  const router = useRouter();
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);

  // All state declarations
  const [bookInfo, setBookInfo] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthExpanded, setIsAuthExpanded] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [activeAuthor, setActiveAuthor] = useState(null);
  const [activeAuthorDetails, setActiveAuthorDetails] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [allBooks, setAllBooks] = useState([]);

  // All effects
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Remove ISBN from slug if present
        const cleanSlug = decodedSlug.replace(/-\d{13}$/, '');
        const bookData = await fetchBookBySlug(cleanSlug);
        console.log('Raw book data:', bookData); // Debug raw data

        const expectedSlug = `${cleanSlug}-${bookData.isbn13}`;
        if (decodedSlug !== expectedSlug) {
          console.log(`Redirecting from ${decodedSlug} ➜ ${expectedSlug}`);
          window.location.replace(`/books/${expectedSlug}`);
          return;
        }

        if (!bookData) {
          throw new Error("Book not found");
        }

        // Process authors and writers
        const allAuthors = [
          bookData.author,
          ...(bookData.writers || [])
        ].filter(Boolean).map(author => ({
          id: author.id,
          author_name: author.name,
          authslug: author.slug,
          image: author.imageUrl,
          authorDescription: author.description,
          authorSocial: author.socialMedia ?
            (typeof author.socialMedia === 'string' ? JSON.parse(author.socialMedia) : author.socialMedia)
            : {}
        }));

        // Process categories and genres into strings for backward compatibility
        const categoryNames = [
          bookData.category,
          ...(bookData.additionalCategories || [])
        ].filter(Boolean).map(cat => cat.name).join(', ');

        const genreNames = [
          bookData.genre,
          ...(bookData.additionalGenres || [])
        ].filter(Boolean).map(gen => gen.name).join(', ');

        // Create processed book data with combined information
        const processedBook = {
          ...processBookData(bookData),
          author: allAuthors[0] || null,
          authors: allAuthors,
          category: categoryNames,
          genre: genreNames,
          categories: bookData.category ? [bookData.category, ...(bookData.additionalCategories || [])] : [],
          genres: bookData.genre ? [bookData.genre, ...(bookData.additionalGenres || [])] : []
        };
        console.log('Processed book aPlusContent:', processedBook.aPlusContent); // Debug A+ Content
        setBookInfo(processedBook);

        // Set activeTab when book data is available
        if (processedBook.author) {
          setActiveTab(processedBook.author.author_name);
        }

        // Set the initial active author details
        if (processedBook.authors && processedBook.authors.length > 0) {
          setActiveAuthorDetails(processedBook.authors[0]); 
        } else if (processedBook.author) {
          setActiveAuthorDetails(processedBook.author); 
        } else {
          setActiveAuthorDetails(null); 
        }

        // Update the authorsArray to include all authors
        const authorsArray = allAuthors.map(author => ({
          name: author.author_name,
          slug: author.authslug
        }));

        // Fetch related books
        const relatedResponse = await fetch(getApiUrl("/api/public/books"));
        if (relatedResponse.ok) {
          const allBooksResponse = await relatedResponse.json();
          setAllBooks(allBooksResponse);
        
          const processedBooks = allBooksResponse.map(book => processBookData(book));  

          if (processedBook.genre) {
            const genreMatchedBooks = processedBooks.filter((book) => {
              if (book.slug === processedBook.slug) return false;

              const bookGenres =
                book.genre?.toLowerCase()?.split(",")?.map((g) => g.trim()) || [];
              const currentBookGenres =
                processedBook.genre
                  ?.toLowerCase()
                  ?.split(",")
                  ?.map((g) => g.trim()) || [];

              return bookGenres.some((g) => currentBookGenres.includes(g));
            });

            // remove duplicates by title + language priority
            const uniqueRelatedBooks =
              dedupeRelatedByLanguagePriority(genreMatchedBooks);
            setRelatedBooks(uniqueRelatedBooks.slice(0, 6));
          }

        }

        setError(null);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (decodedSlug) {
      fetchData();
    }
  }, [decodedSlug]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let currentSection = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          currentSection = section.getAttribute("id");
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const authorsList = await getAllAuthors();
        setAuthors(authorsList);
        if (authorsList.length > 0) {
          setActiveAuthor(authorsList.find(
            (author) => author.author_name === activeTab
          ) || authorsList[0]);
        }
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    fetchAuthors();
  }, [activeTab]);

  // Early returns
  if (loading) {
    return <Loader />;
  }

  if (error || !bookInfo) {
    return <div className="container mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Error</h2>
      <p>{error || "Book not found"}</p>
      <Link href="/books" className="text-blue-500 underline mt-4 inline-block">
        Return to Books
      </Link>
    </div>;
  }

  const authorimgurl = "/author-defaultimages.png";

  // Process book images
  const processImageUrl = (url) => {
    if (!url) return '';
    return url.replace(/[\[\]"]/g, '').trim();
  };

  const thumbnails = Array.isArray(bookInfo.book_thumbnail)
    ? bookInfo.book_thumbnail.map(processImageUrl)
    : typeof bookInfo.book_thumbnail === 'string'
      ? [processImageUrl(bookInfo.book_thumbnail)]
      : [];

  const clonedThumbnails = [...thumbnails, ...thumbnails].filter(Boolean);

  // Process authors
  let authorNames = [];
  if (bookInfo.authors && Array.isArray(bookInfo.authors)) {
    authorNames = bookInfo.authors.map(author => author.author_name);
  } else if (bookInfo.author) {
    authorNames = [bookInfo.author.author_name];
  } else {
    authorNames = ["Unknown Author"];
  }

  const pageTitle = `${bookInfo.title} by ${authorNames.join(', ')} | BluOne Ink Book`;
  const pageDescription = bookInfo.meta_description;
  const canonicalUrl = `https://www.bluone.ink/books/${slug}`;

  // copy Link
  // const Tooltip = ({ message, show }) => {
  //   return (
  //     <div
  //       className={`absolute bg-gray-700 text-white text-xs rounded py-1 px-1 transition-opacity duration-100 ${show ? "opacity-100" : "opacity-0"
  //         }`}
  //       style={{
  //         top: "28px",
  //         left: "200px",
  //         transform: "translateX(-50%)",
  //         pointerEvents: "none",
  //       }}
  //     >
  //       {message}
  //     </div>
  //   );
  // };

  // const copyLink = () => {
  //   navigator.clipboard.writeText(window.location.href).then(() => {
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000);
  //   });
  // };

  // read more read less
  const maxLength = 500;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const title = 'Check this out!';

  return (
    <>
      <main id="top">
        <HelmetProvider>
          <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <link rel="canonical" href={canonicalUrl} />
          </Helmet>
        </HelmetProvider>

        <ScriptLoader />

        <section className="relative z-[111] bg-white">

          <div className="container bg-white p-6 mt-10 z-50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">

              <div className="w-full md:w-[50%] lg:sticky lg:top-14 h-fit flex flex-wrap lg:flex-nowrap lg:flex gap-4">
                {/* Title & Author */}
                <div className="md:hidden block">
                <div className="flex gap-1 text-[#000]">
                  <p className="flex items-center text-[12px] font-semibold"><Link href={`/books`}>Books</Link></p>
                  <p className="flex items-center pt-1 w-3"><RiArrowRightSLine /></p>
                  <p className="flex items-center text-[12px]"><Link href={`/books?category=${bookInfo.category}`}>{bookInfo.category}</Link></p>
                </div>
                  <h2 className="text-[28px] lg:text-4xl font-semibold">{bookInfo.title}</h2>
                  <div className="flex flex-wrap items-center gap-1">
                    {authorNames.map((author, index) => {
                      const authorObj = bookInfo.authors?.find(a => a.author_name === author);
                      const key = authorObj?.author_id || authorObj?.authslug || index; // safer unique key
                      return (
                        <i key={key}>
                          <div className="flex items-center pt-2">
                            <Link
                              href={`/authors/${authorObj?.authslug || ""}`}
                              className="text-[20px] text-[#007DD7]"
                            >
                              {author}
                            </Link>
                            {index < authorNames.length - 1 && <span>,&nbsp;</span>}
                          </div>
                        </i>
                      );
                    })}
                  </div>
                  <p className="text-xl font-bold mt-2">₹{bookInfo.price}</p>
                </div>

                {/* Thumbnails */}
                <div className="order-2 lg:order-1 flex lg:flex-col gap-4 overflow-x-auto">
                  {/* Default image thumbnail */}
                  <div
                    className="w-12 h-12 bg-gray-300 border lg:overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(processImageUrl(bookInfo.book_image))}
                  >
                    <img
                      src={processImageUrl(bookInfo.book_image)}
                      alt="Default Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Cloned thumbnails */}
                  {clonedThumbnails && clonedThumbnails.length > 0 && clonedThumbnails.slice(0, 5).map((thumbnail, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 bg-gray-300 border overflow-hidden cursor-pointer"
                      onClick={() => setSelectedImage(thumbnail)}
                    >
                      <img
                        src={thumbnail}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Main Image */}
                <div className="order-1 lg:order-2 w-full h-[500px] bg-gray-200 border flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedImage || processImageUrl(bookInfo.book_image)}
                    alt={bookInfo.title}
                    className="h-full object-contain"
                  />
                </div>

              </div>


              {/* Right Side: Scrollable Book Info */}
              <div className="w-full md:w-[50%] space-y-4">
                {/* Title & Author */}
                <div className="hidden md:block">
                <div className="flex gap-1 text-[#000]">
                  <p className="flex items-center text-[12px] font-semibold"><Link href={`/books`}>Books</Link></p>
                  <p className="flex items-center pt-1 w-3"><RiArrowRightSLine /></p>
                  <p className="flex items-center text-[12px]">
                    <Link href={`/books?category=${bookInfo.category?.split(',')[0]}`}>
                      {bookInfo.category?.split(',')[0]}
                    </Link>
                  </p>
                </div>
                <div className="flex gap-4 pt-2">
                <h2 className="text-[28px] leading-8 font-semibold">{bookInfo.title}</h2>
                <AddToAnyShare />
                </div>
                  
                  <div className="flex flex-wrap items-center gap-1">
                    {authorNames.map((author, index) => {
                      const authorObj = bookInfo.authors?.find(a => a.author_name === author);
                      return (
                        <i><div key={index} className="flex text-[16px] items-center pt-2">
                          <Link
                            href={`/authors/${authorObj?.authslug || ""}`}
                            className="text-[16px] text-[#007DD7]"
                          >
                            {author}
                          </Link>
                          {index < authorNames.length - 1 && <span>,&nbsp;</span>}
                        </div></i>
                      );
                    })}
                  </div>
                  <p className="text-xl font-semibold font-barlow mt-2">₹{bookInfo.price}</p>
                </div>
               {/* BUY NOW Button */}
                  <button
                    className="bg-[#007DD7] text-white rounded-full px-6 py-2 text-sm font-medium font-barlow mb-4"
                    onClick={() => setShowButtons(!showButtons)}
                  >
                    {showButtons ? "Buy Now" : "Buy Now"}
                  </button>

                  {/* Conditional Rendering of Purchase Buttons */}
                  {showButtons && (
                    <div
                      className={`flex flex-wrap ${
                        (() => {
                          const activeButtons = [
                            bookInfo.amazonlink,
                            bookInfo.amazon_comlink,
                            bookInfo.flipkartlink,
                            bookInfo.bookswagonLink,
                            bookInfo.sapnaBooksLink,
                            bookInfo.preorder || bookInfo.orderbtn,
                            bookInfo.downloadaisheet,
                          ].filter(Boolean).length;

                          if (activeButtons === 3) return "lg:w-[70%]";
                          if (activeButtons > 3) return "w-full";
                          return "lg:w-[100%]";
                        })()
                      } md:gap-4 gap-2 pt-3`}
                    >
                      {bookInfo.amazonlink && (
                        <Link href={bookInfo.amazonlink} target="_blank">
                          <button>
                            <Image
                              src="/amazon_in.png"
                              width={118}
                              height={118}
                              alt="Amazon India"
                              className="max-w-full h-auto"
                            />
                          </button>
                        </Link>
                      )}

                      {bookInfo.amazon_comlink && (
                        <Link href={bookInfo.amazon_comlink} target="_blank">
                          <button>
                            <Image
                              src="/amazon_com.png"
                              width={135}
                              height={135}
                              alt="Amazon.com"
                              className="max-w-full h-auto"
                            />
                          </button>
                        </Link>
                      )}

                      {bookInfo.flipkartlink && (
                        <Link href={bookInfo.flipkartlink} target="_blank">
                          <button>
                            <Image
                              src="/flipkart.png"
                              width={122}
                              height={122}
                              alt="Flipkart"
                              className="max-w-full h-auto"
                            />
                          </button>
                        </Link>
                      )}

                      {bookInfo.bookswagonLink && (
                        <Link href={bookInfo.bookswagonLink} target="_blank">
                          <button>
                            <Image
                              src="/bookswagon.png"
                              width={122}
                              height={122}
                              alt="Bookswagon"
                              className="max-w-full h-auto btn_bookswagon"
                            />
                          </button>
                        </Link>
                      )}

                      {bookInfo.sapnaBooksLink && (
                        <Link href={bookInfo.sapnaBooksLink} target="_blank">
                          <button>
                            <Image
                              src="/sapna_btn.png"
                              width={100}
                              height={122}
                              alt="Sapna"
                              className="max-w-full h-auto btn_sapna"
                            />
                          </button>
                        </Link>
                      )}

                      

                      {(bookInfo.preorder || bookInfo.orderbtn) && (
                        <div className="text-center">
                          <Link
                            href={
                              new Date() < new Date(bookInfo.preorderdate)
                                ? bookInfo.preorder
                                : bookInfo.orderbtn || bookInfo.preorder
                            }
                            target="_blank"
                          >
                            <button className="bg-[#FF8100] rounded-full px-10 py-3.5 font-barlow text-white">
                              <h6 className="font-semibold text-[16px] lg:text-[18px]">
                                {new Date().toISOString().split("T")[0] < bookInfo.preorderdate
                                  ? "PRE-ORDER"
                                  : "ORDER NOW"}
                              </h6>
                            </button>
                          </Link>

                          {new Date().toISOString().split("T")[0] < bookInfo.preorderdate &&
                            bookInfo.preordertext && (
                              <p className="mt-1 text-[12px] font-barlow">{bookInfo.preordertext}</p>
                            )}
                        </div>
                      )}

                      {bookInfo.downloadaisheet && (
                        <Link href={bookInfo.downloadaisheet} target="_blank">
                          <button className="bg-white border-2 border-[#FF8100] rounded-full px-10 py-3 font-barlow text-black">
                            <h6 className="font-semibold text-[18px]">Preview Sample</h6>
                          </button>
                        </Link>
                      )}
                    </div>
                  )}


                {/* <AddToAnyShare /> */}

                {/* AI Sheet Link */}
                {bookInfo.aiSheetUrl && (
                  <a
                    href={bookInfo.aiSheetUrl}
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download AI Sheet
                  </a>
                )}

                {/* Specification */}
                <div>
                  <h3 className="text-[20px] lg:text-1xl font-semibold mt-4">Specification</h3>
                  <ul className="text-sm text-[#000] mt-1 space-y-0">
                    <li>
  {allBooks &&
    [bookInfo, ...(allBooks
      ?.filter((book) => {
        if (book.id === bookInfo.id) return false;

        const currentTitleStart = bookInfo.title
          .toLowerCase()
          .split(" ")
          .slice(0, 2)
          .join(" ");

        return book.title.toLowerCase().startsWith(currentTitleStart);
      }) || [])]
      .map((book) => ({
        language: book.language,
        slug: book.slug,
      }))
      .filter(
        (v, i, a) =>
          a.findIndex((t) => t.language === v.language) === i
      ).length > 1 && ( 
        <>
          <label
            htmlFor="language-select"
            className="mr-2"
          >
            Language:
          </label>
          <select
            id="language-select"
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
            onChange={(e) => {
              const selectedSlug = e.target.value;
              if (selectedSlug && selectedSlug !== bookInfo.slug) {
                window.location.href = `/books/${selectedSlug}`;
              }
            }}
            value={bookInfo.slug}
          >
            {[bookInfo, ...(allBooks
              ?.filter((book) => {
                if (book.id === bookInfo.id) return false;

                const currentTitleStart = bookInfo.title
                  .toLowerCase()
                  .split(" ")
                  .slice(0, 2)
                  .join(" ");

                return book.title.toLowerCase().startsWith(currentTitleStart);
              }) || [])]
              .map((book) => ({
                language: book.language,
                slug: book.slug,
              }))
              .filter(
                (v, i, a) =>
                  a.findIndex((t) => t.language === v.language) === i
              )
              .map((langObj, index) => (
                <option key={index} value={langObj.slug}>
                  {langObj.language}
                </option>
              ))}
          </select>
        </>
      )}
</li>

                    <li>Format: {bookInfo?.book_format}</li>
                    <li>Pages: {bookInfo.pages} pages</li>
                    <li>ISBN-13: {bookInfo.isbn13}</li>
                    <li>Item Weight: {bookInfo.weight}</li>
                    <li>Dimensions: {bookInfo.dimension}</li>
                    <li>Genre: {bookInfo?.genre}</li>
                  </ul>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-[20px] lg:text-1xl font-semibold mt-6">Description</h3>
                  <p className="text-[16px] leading-1 text-start font-normal book-info-html pt-2">
                    <span
                      className="text-[26px] font-ibm"
                      dangerouslySetInnerHTML={{
                        __html: (isExpanded
                          ? bookInfo.about_book
                          : `${bookInfo.about_book?.substring(0, maxLength)} `)
                          ?.replace(/&lt;/g, '<')
                          .replace(/&gt;/g, '>')
                          .replace(/&quot;/g, '"')
                          .replace(/&amp;/g, '&')
                          .replace(/\\"/g, '"')
                          .replace(/\\\\/g, '\\')
                          .replace(/&nbsp;/g, ' ')
                      }}
                    />
                    {bookInfo.about_book && bookInfo.about_book.length > maxLength && (
                      <button
                        onClick={toggleExpand}
                        className="text-[#0D1928] underline font-medium inline"
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* A+ Content Section */}
        {bookInfo.aPlusContent && bookInfo.aPlusContent.length > 0 && (() => {
          // Filter out empty or invalid items
          const validContent = bookInfo.aPlusContent.filter(item => {
            if (item.type === 'image') {
              const imageUrl = item.url || item.imageUrl;
              return imageUrl && imageUrl.trim() !== '';
            }
            if (item.type === 'text') {
              return item.content && item.content.trim() !== '';
            }
            if (item.type === 'video') {
              return item.url && item.url.trim() !== '';
            }
            if (item.type === 'comparison') {
              return item.data && item.data.headers && item.data.rows;
            }
            // Fallback: check if content exists
            return item.content && item.content.trim() !== '';
          });
          
          console.log('A+ Content - Total items:', bookInfo.aPlusContent.length, 'Valid items:', validContent.length);
          
          if (validContent.length === 0) return null;
          
          return (
            <section id="a-plus-content" className="container mx-auto py-10 mt-14 mb-14">
              <div className="max-w-7xl mx-auto">
                <h3 className="text-left text-[20px] lg:text-2xl font-semibold mb-6">From the Publisher</h3>
                
                <div className="space-y-6">
                  {validContent.map((contentItem, index) => {
                  // Get image URL - check both 'url' and 'imageUrl' fields
                  const imageUrl = contentItem.url || contentItem.imageUrl;
                  
                  // Render based on content type
                  if (contentItem.type === 'image' && imageUrl && imageUrl.trim() !== '') {
                    return (
                      <div key={index} className="w-full">
                        <img
                          src={imageUrl}
                          alt={contentItem.alt || contentItem.title || `A+ Content ${index + 1}`}
                          className="w-full object-cover"
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      </div>
                    );
                  }
                  
                  if (contentItem.type === 'text' && contentItem.content) {
                    return (
                      <div 
                        key={index} 
                        className="w-full"
                        dangerouslySetInnerHTML={{ __html: contentItem.content }}
                      />
                    );
                  }
                  
                  if (contentItem.type === 'video' && contentItem.url) {
                    // Check if it's a YouTube URL
                    const isYouTube = contentItem.url.includes('youtube.com') || contentItem.url.includes('youtu.be');
                    
                    if (isYouTube) {
                      // Extract video ID from YouTube URL
                      let videoId = '';
                      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
                      const match = contentItem.url.match(youtubeRegex);
                      if (match) {
                        videoId = match[1];
                      }
                      
                      return (
                        <div key={index} className="w-full">
                          {videoId && (
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          )}
                          {contentItem.title && (
                            <h4 className="text-xl font-semibold mt-4">{contentItem.title}</h4>
                          )}
                        </div>
                      );
                    } else {
                      // Direct video URL
                      return (
                        <div key={index} className="w-full">
                          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <video
                              src={contentItem.url}
                              controls
                              className="absolute top-0 left-0 w-full h-full rounded-lg"
                            />
                          </div>
                          {contentItem.title && (
                            <h4 className="text-xl font-semibold mt-4">{contentItem.title}</h4>
                          )}
                        </div>
                      );
                    }
                  }
                  
                  if (contentItem.type === 'comparison' && contentItem.data) {
                    return (
                      <div key={index} className="w-full overflow-x-auto">
                        {contentItem.title && (
                          <h4 className="text-xl font-semibold mb-4">{contentItem.title}</h4>
                        )}
                        <table className="w-full border-collapse border border-gray-300">
                          {contentItem.data.headers && (
                            <thead>
                              <tr>
                                {contentItem.data.headers.map((header, hIndex) => (
                                  <th key={hIndex} className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                          )}
                          <tbody>
                            {contentItem.data.rows && contentItem.data.rows.map((row, rIndex) => (
                              <tr key={rIndex}>
                                {row.map((cell, cIndex) => (
                                  <td key={cIndex} className="border border-gray-300 px-4 py-2">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  
                  // Fallback: render as HTML if content exists
                  if (contentItem.content) {
                    return (
                      <div 
                        key={index} 
                        className="w-full"
                        dangerouslySetInnerHTML={{ __html: contentItem.content }}
                      />
                    );
                  }
                  
                  return null;
                  })}
                </div>
              </div>
            </section>
          );
        })()}

        {/* About the Book Author */}
        {activeAuthorDetails && activeAuthorDetails.author_name !== "Bluone Ink" && bookInfo.authors && bookInfo.authors.length > 0 && (
          <section
            id="about-author"
            className="container mx-auto text-center py-10 mt-20 pt-0 p-0 lg:w-[70%] lg:mx-auto"
          >
            <div className="about-author author-details-container mx-auto p-10 pt-5 rounded-2xl w-full lg:w-[85%] bg-[#FF81001A]">
              <div className="curve_img">
                <Image src={CurveTop} alt="Curve Top" />
              </div>
              {/* Display images for all authors */}
              <div className="flex justify-center space-x-2 lg:space-x-4 mb-2">
                {bookInfo.authors.map((author, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer z-[10] ${activeAuthorDetails?.id === author.id ? 'border-[#FF8100] border-4 rounded-full' : 'opacity-80 grayscale'}`}
                    onClick={() => {
                      setActiveAuthorDetails(author);
                      setIsAuthExpanded(false); // Collapse description when switching author
                    }}
                  >
                    <img
                      src={author.image || authorimgurl}
                      alt={author.author_name}
                      className="rounded-full w-[100px] h-[100px] lg:w-[150px] lg:h-[150px] object-cover transition duration-200"
                      onError={(e) => {
                        e.currentTarget.src = authorimgurl;
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="lg:p-8 pt-10 mx-auto">
                <div className="relative z-[10]">
                  <i>
                    <h3 className="font-medium text-3xl mb-4">
                      {/* Display active author name */}
                      {activeAuthorDetails?.author_name}
                    </h3>
                  </i>
                  <p className="text-gray-700 text-start mb-4 text-lg leading-relaxed">
                    {isAuthExpanded
                      ? activeAuthorDetails?.authorDescription || "Description not available."
                      : `${activeAuthorDetails?.authorDescription?.substring(0, 600) || ""}`}
                    {activeAuthorDetails?.authorDescription &&
                      activeAuthorDetails.authorDescription.length > 600 && (
                        <button
                          onClick={() => setIsAuthExpanded(!isAuthExpanded)}
                          className="text-[#0D1928] underline font-medium ml-2"
                        >
                          {isAuthExpanded ? "Read Less" : "Read More"}
                        </button>
                      )}
                  </p>
                  {/* Author's Social Media Links for active author */}
                  {activeAuthorDetails?.authorSocial && Object.keys(activeAuthorDetails.authorSocial).length > 0 && (
                    <ul className="list-disc flex flex-wrap justify-center gap-6 pb-6">
                      {Object.entries(activeAuthorDetails.authorSocial).map(([platform, url], index) => {
                        let platformName = platform;
                        // Basic mapping for common platforms, you can expand this
                        if (platform === 'x') platformName = 'X (Twitter)';
                        else if (platform === 'linkedin') platformName = 'LinkedIn';
                        else if (platform === 'facebook') platformName = 'Facebook';
                        else if (platform === 'instagram') platformName = 'Instagram';
                        else if (platform === 'youtube') platformName = 'YouTube';

                        return (
                          <li
                            key={index}
                            className="list-none hover:underline hover:text-[#007DD7]"
                          >
                            <a
                              href={`${url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {platformName.charAt(0).toUpperCase() + platformName.slice(1)}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  <div className="w-full">
                    <h6 className="text-[#007DD7] text-md">
                      {/* Link to active author's page */}
                      {activeAuthorDetails?.authslug && (
                        <Link
                          href={`/authors/${activeAuthorDetails.authslug}`}
                          className="text-blue-500 underline"
                        >
                          Visit the Author Page
                        </Link>
                      )}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}



        {/* Endorsement section */}
        <section id="endorsements">
          {bookInfo.testimonials && bookInfo.testimonials.length > 0 && (
            <div className="wrapper bg-[#DDF5FF] w-full mt-14 mb-14">
              <div className="container mx-auto p-10 pt-10">
                <SliderBook testimonials={bookInfo.testimonials} />
              </div>
            </div>
          )}
        </section>

        {/* Press Coverage section */}
        <section id="press-coverage">
          {bookInfo.pressCoverage && (
            <div className="wrapper bg-white w-full mt-14 mb-14">
              <div className="container mx-auto p-10 pt-10">
                <div className="flex items-center gap-2 justify-center pb-2">
                  <Image src={inkdouble1} width={55} height={55} alt="inkdouble1" />
                  <i>
                    <h3 className="font-medium text-2xl md:text-2xl text-center">
                      Press Coverage
                    </h3>
                  </i>
                  <Image src={inkdouble2} width={55} height={55} alt="inkdouble2" />
                </div>
                <div
                  className="mt-8 prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: bookInfo.pressCoverage
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>')
                      .replace(/&quot;/g, '"')
                      .replace(/&amp;/g, '&')
                      .replace(/\\"/g, '"')
                      .replace(/\\\\/g, '\\')
                  }}
                />
              </div>
            </div>
          )}
        </section>

        {/* Spotlight section */}
        <section id="spotlight">
          <Spotlight bookSlug={bookInfo.slug?.replace(/-\d{13}$/, '') || bookInfo.slug} />
        </section>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <section id="related-titles" className="container">
            <div className="flex items-center gap-2 justify-center pb-6 pt-6">
              <Image src={inkdouble1} width={55} height={55} alt="inkdouble1" />
              <i>
                <h3 className="font-medium text-2xl md:text-2xl text-center">
                  Related Titles
                </h3>
              </i>
              <Image src={inkdouble2} width={55} height={55} alt="inkdouble2" />
            </div>

            <div className="flex items-center justify-center pb-6">
              <Link href="/books">
                <i>
                  <h4 className="text-[#007DD7] text-base underline font-medium">
                    View All Titles
                  </h4>
                </i>
              </Link>
            </div>

            <div
              className={`related_title_sec flex flex-wrap justify-center pb-10`}
            >
              {relatedBooks.map((relatedBook, i) => (
                <div
                  key={i}
                  className="related_title_sec_card flex-1 p-4 mb-4 hover:shadow-md input-border border-[#ffffff00] hover:border-[#BABABA] rounded-md"
                  style={{ maxWidth: "200px" }}
                >
                  <Link
                    href={`/books/${relatedBook.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <BooksCards
                      title={relatedBook.title}
                      coverImage={Array.isArray(relatedBook.book_image)
                        ? relatedBook.book_image[0]?.replace(/[\[\]"]/g, '')
                        : typeof relatedBook.book_image === 'string'
                          ? relatedBook.book_image.replace(/[\[\]"]/g, '')
                          : ''}
                      bookPrice={`₹${relatedBook.price}`}
                      authorName={
                        relatedBook.author?.author_name ||
                        (Array.isArray(relatedBook.author)
                          ? relatedBook.author.join(', ')
                          : relatedBook.author)
                      }
                      imageContainerClass="h-[200px] lg:h-[250px] border_card"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sidebar Navigation */}
        <div className="hidden lg:block aside_fixed">
          <ul className="flex flex-col">
            <li>
              <a
                href="#top"
                className={`pb-2 ${activeSection === "top"
                    ? "text-[#007BD7] font-medium"
                    : "text-[#0D1928] font-light"
                  }`}
              >
                Go to Top
              </a>
            </li>
            <li>&nbsp;</li>
            <li>
              <a
                href="#about-author"
                className={`pb-2 ${activeSection === "about-author"
                    ? "text-[#007BD7] font-medium"
                    : "text-[#0D1928] font-light"
                  }`}
              >
                About the Author
              </a>
            </li>
            {bookInfo.aPlusContent && bookInfo.aPlusContent.length > 0 && (
              <li>
                <a
                  href="#a-plus-content"
                  className={`pb-2 ${activeSection === "a-plus-content"
                      ? "text-[#007BD7] font-medium"
                      : "text-[#0D1928] font-light"
                    }`}
                >
                  A+ Content
                </a>
              </li>
            )}
            {bookInfo.testimonials && bookInfo.testimonials.length > 0 && (
              <li>
                <a
                  href="#endorsements"
                  className={`pb-2 ${activeSection === "endorsements"
                      ? "text-[#007BD7] font-medium"
                      : "text-[#0D1928] font-light"
                    }`}
                >
                  Endorsements
                </a>
              </li>
            )}
            {bookInfo.pressCoverage && (
              <li>
                <a
                  href="#press-coverage"
                  className={`pb-2 ${activeSection === "press-coverage"
                      ? "text-[#007BD7] font-medium"
                      : "text-[#0D1928] font-light"
                    }`}
                >
                  Press Coverage
                </a>
              </li>
            )}
            {bookInfo.spotlight && bookInfo.spotlight.length > 0 && (
              <li>
                <a
                  href="#spotlight"
                  className={`pb-2 ${activeSection === "spotlight"
                      ? "text-[#007BD7] font-medium"
                      : "text-[#0D1928] font-light"
                    }`}
                >
                  Spotlight
                </a>
              </li>
            )}
            <li>
              <a
                href="#related-titles"
                className={`pb-2 ${activeSection === "related-titles"
                    ? "text-[#007BD7] font-medium"
                    : "text-[#0D1928] font-light"
                  }`}
              >
                Related Titles
              </a>
            </li>
          </ul>
        </div>
      </main>
    </>
  );
};

export default Page;
