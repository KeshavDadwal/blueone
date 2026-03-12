"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiArrowRightSLine } from "react-icons/ri";

import inkdouble1 from "@/app/assests/image/inkdouble1.svg";
import inkdouble2 from "@/app/assests/image/inkdouble2.svg";
import CurveTop from "@/app/assests/image/aboutauthorbg.png";

import BooksCards from "../BooksCards";
import Spotlight from "@/app/components/Spotlight";
import ScriptLoader from "@/app/ScriptLoader";
import AddToAnyShare from "@/app/components/ImagePreviewSection";
import Loader from "@/app/components/Loader";

export default function BookPageClient({ bookInfo, relatedBooks, versions, slug }) {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthExpanded, setIsAuthExpanded] = useState(false);
  const [activeAuthorDetails, setActiveAuthorDetails] = useState(
    bookInfo?.authors?.[0] || bookInfo?.author || null
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const authorimgurl = "/author-defaultimages.png";

  const processImageUrl = (url) => {
    if (!url) return "";
    return url.replace(/[\[\]"]/g, "").trim();
  };

  const thumbnails = useMemo(() => {
    const raw = bookInfo?.book_thumbnail;
    if (Array.isArray(raw)) return raw.map(processImageUrl);
    if (typeof raw === "string") return [processImageUrl(raw)];
    return [];
  }, [bookInfo?.book_thumbnail]);

  const clonedThumbnails = useMemo(
    () => [...thumbnails, ...thumbnails].filter(Boolean),
    [thumbnails]
  );

  const authorNames = useMemo(() => {
    if (Array.isArray(bookInfo?.authors) && bookInfo.authors.length > 0) {
      return bookInfo.authors.map((a) => a.author_name);
    }
    if (bookInfo?.author?.author_name) return [bookInfo.author.author_name];
    return ["Unknown Author"];
  }, [bookInfo]);

  const maxLength = 500;

  const toggleExpand = () => setIsExpanded((v) => !v);

  return (
    <>
      <main id="top" suppressHydrationWarning>
        {!mounted ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            <ScriptLoader />

        <section className="relative z-[111] bg-white">
          <div className="container bg-white p-6 mt-10 z-50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-[50%] lg:sticky lg:top-14 h-fit flex flex-wrap lg:flex-nowrap lg:flex gap-4">
                <div className="md:hidden block">
                  <div className="flex gap-1 text-[#000]">
                    <p className="flex items-center text-[12px] font-semibold">
                      <Link href={`/books`}>Books</Link>
                    </p>
                    <p className="flex items-center pt-1 w-3">
                      <RiArrowRightSLine />
                    </p>
                    <p className="flex items-center text-[12px]">
                      <Link href={`/books?category=${bookInfo.category}`}>
                        {bookInfo.category}
                      </Link>
                    </p>
                  </div>
                  <h2 className="text-[28px] lg:text-4xl font-semibold">
                    {bookInfo.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-1">
                    {authorNames.map((author, index) => {
                      const authorObj = bookInfo.authors?.find(
                        (a) => a.author_name === author
                      );
                      const key = authorObj?.authslug ?? authorObj?.id ?? index;
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

                <div className="order-2 lg:order-1 flex lg:flex-col gap-4 overflow-x-auto">
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

                  {clonedThumbnails &&
                    clonedThumbnails.length > 0 &&
                    clonedThumbnails.slice(0, 5).map((thumbnail, i) => (
                      <div
                        key={`${thumbnail}-${i}`}
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

                <div className="order-1 lg:order-2 w-full h-[500px] bg-gray-200 border flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedImage || processImageUrl(bookInfo.book_image)}
                    alt={bookInfo.title}
                    className="h-full object-contain"
                  />
                </div>
              </div>

              <div className="w-full md:w-[50%] space-y-4">
                <div className="hidden md:block">
                  <div className="flex gap-1 text-[#000]">
                    <p className="flex items-center text-[12px] font-semibold">
                      <Link href={`/books`}>Books</Link>
                    </p>
                    <p className="flex items-center pt-1 w-3">
                      <RiArrowRightSLine />
                    </p>
                    <p className="flex items-center text-[12px]">
                      <Link href={`/books?category=${bookInfo.category?.split(",")[0]}`}>
                        {bookInfo.category?.split(",")[0]}
                      </Link>
                    </p>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <h2 className="text-[28px] leading-8 font-semibold">{bookInfo.title}</h2>
                    {mounted ? <AddToAnyShare /> : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-1">
                    {authorNames.map((author, index) => {
                      const authorObj = bookInfo.authors?.find(
                        (a) => a.author_name === author
                      );
                      const key = authorObj?.authslug ?? authorObj?.id ?? index;
                      return (
                        <i key={key}>
                          <div className="flex text-[16px] items-center pt-2">
                            <Link
                              href={`/authors/${authorObj?.authslug || ""}`}
                              className="text-[16px] text-[#007DD7]"
                            >
                              {author}
                            </Link>
                            {index < authorNames.length - 1 && <span>,&nbsp;</span>}
                          </div>
                        </i>
                      );
                    })}
                  </div>
                  <p className="text-xl font-semibold font-barlow mt-2">₹{bookInfo.price}</p>
                </div>

                <button
                  className="bg-[#007DD7] text-white rounded-full px-6 py-2 text-sm font-medium font-barlow mb-4"
                  onClick={() => setShowButtons(!showButtons)}
                >
                  Buy Now
                </button>

                {showButtons && (
                  <div className="flex flex-wrap md:gap-4 gap-2 pt-3">
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
                  </div>
                )}

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

                <div>
                  <h3 className="text-[20px] lg:text-1xl font-semibold mt-4">Specification</h3>
                  <ul className="text-sm text-[#000] mt-1 space-y-0">
                    <li>
                      {Array.isArray(versions) && versions.length > 1 && (
                        <>
                          <label htmlFor="language-select" className="mr-2">
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
                            {versions.map((v) => (
                              <option key={`${v.language}-${v.slug}`} value={v.slug}>
                                {v.language}
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

                <div>
                  <h3 className="text-[20px] lg:text-1xl font-semibold mt-6">Description</h3>
                  <p className="text-[16px] leading-1 text-start font-normal book-info-html pt-2">
                    <span
                      className="text-[26px] font-ibm"
                      dangerouslySetInnerHTML={{
                        __html: (isExpanded
                          ? bookInfo.about_book
                          : `${bookInfo.about_book?.substring(0, maxLength)} `)
                          ?.replace(/&lt;/g, "<")
                          .replace(/&gt;/g, ">")
                          .replace(/&quot;/g, '"')
                          .replace(/&amp;/g, "&")
                          .replace(/\\"/g, '"')
                          .replace(/\\\\/g, "\\")
                          .replace(/&nbsp;/g, " "),
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

        {/* About the Book Author */}
        {activeAuthorDetails &&
          activeAuthorDetails.author_name !== "Bluone Ink" &&
          Array.isArray(bookInfo.authors) &&
          bookInfo.authors.length > 0 && (
            <section
              id="about-author"
              className="container mx-auto text-center py-10 mt-20 pt-0 p-0 lg:w-[70%] lg:mx-auto"
            >
              <div className="about-author author-details-container mx-auto p-10 pt-5 rounded-2xl w-full lg:w-[85%] bg-[#FF81001A]">
                <div className="curve_img">
                  <Image src={CurveTop} alt="Curve Top" />
                </div>

                <div className="flex justify-center space-x-2 lg:space-x-4 mb-2">
                  {bookInfo.authors.map((author, index) => (
                    <div
                      key={author?.id ?? author?.authslug ?? index}
                      className={`cursor-pointer z-[10] ${
                        activeAuthorDetails?.id === author.id
                          ? "border-[#FF8100] border-4 rounded-full"
                          : "opacity-80 grayscale"
                      }`}
                      onClick={() => {
                        setActiveAuthorDetails(author);
                        setIsAuthExpanded(false);
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
                        {activeAuthorDetails?.author_name}
                      </h3>
                    </i>

                    <p className="text-gray-700 text-start mb-4 text-lg leading-relaxed">
                      {isAuthExpanded
                        ? activeAuthorDetails?.authorDescription ||
                          "Description not available."
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

                    {activeAuthorDetails?.authorSocial &&
                      Object.keys(activeAuthorDetails.authorSocial).length > 0 && (
                        <ul className="list-disc flex flex-wrap justify-center gap-6 pb-6">
                          {Object.entries(activeAuthorDetails.authorSocial).map(
                            ([platform, url], index) => (
                              <li
                                key={`${platform}-${index}`}
                                className="list-none hover:underline hover:text-[#007DD7]"
                              >
                                <a
                                  href={`${url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {platform}
                                </a>
                              </li>
                            )
                          )}
                        </ul>
                      )}

                    <div className="w-full">
                      <h6 className="text-[#007DD7] text-md">
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

            <section id="spotlight">
              <Spotlight
                bookSlug={bookInfo.slug?.replace(/-\d{13}$/, "") || bookInfo.slug}
              />
            </section>
          </>
        )}

        {mounted && relatedBooks?.length > 0 && (
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

            <div className="related_title_sec flex flex-wrap justify-center pb-10">
              {relatedBooks.map((relatedBook) => (
                <div
                  key={relatedBook.id ?? relatedBook.slug ?? relatedBook.title}
                  className="related_title_sec_card flex-1 p-4 mb-4 hover:shadow-md input-border border-[#ffffff00] hover:border-[#BABABA] rounded-md"
                  style={{ maxWidth: "200px" }}
                >
                  <Link href={`/books/${relatedBook.slug}`} style={{ textDecoration: "none" }}>
                    <BooksCards
                      title={relatedBook.title}
                      coverImage={relatedBook.thumbnailUrl}
                      authorName={relatedBook.author?.name ?? ""}
                      imageContainerClass="h-[200px] lg:h-[250px] border_card"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {mounted && (
          <div className="hidden lg:block aside_fixed">
          <ul className="flex flex-col">
            <li>
              <a
                href="#top"
                className={`pb-2 ${
                  activeSection === "top"
                    ? "text-[#007BD7] font-medium"
                    : "text-[#0D1928] font-light"
                }`}
              >
                Go to Top
              </a>
            </li>
            <li>&nbsp;</li>
            {activeAuthorDetails &&
              activeAuthorDetails.author_name !== "Bluone Ink" &&
              Array.isArray(bookInfo.authors) &&
              bookInfo.authors.length > 0 && (
                <li>
                  <a
                    href="#about-author"
                    className={`pb-2 ${
                      activeSection === "about-author"
                        ? "text-[#007BD7] font-medium"
                        : "text-[#0D1928] font-light"
                    }`}
                  >
                    About the Author
                  </a>
                </li>
              )}
            <li>
              <a
                href="#related-titles"
                className={`pb-2 ${
                  activeSection === "related-titles"
                    ? "text-[#007BD7] font-medium"
                    : "text-[#0D1928] font-light"
                }`}
              >
                Related Titles
              </a>
            </li>
          </ul>
          </div>
        )}
      </main>
    </>
  );
}

