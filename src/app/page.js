"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import jlf from "@/app/assests/image/jlf.png";
import plf from "@/app/assests/image/plf.png";
import thejaipur from "@/app/assests/image/thejaipur.png";
import inksingleicon from "@/app/assests/image/inksingleicon.svg";
import Link from "next/link";
import BannerSlider from "./components/BannerSlider";
import inkdouble1 from "@/app/assests/image/inkdouble1.svg";
import inkdouble2 from "@/app/assests/image/inkdouble2.svg";
import Loader from "./components/Loader";
import { fetchAllBooks, processBookData } from "./API/booksapi";
import { fetchHeroSections, processHeroSectionImages } from "./API/heroSectionApi";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet";
import BookDiscovery from "./components/BookDiscovery";
import BannerCarousel from "./components/BannerCarousel";
import Spotlight from "./components/Spotlight";
import AuthorSpotlightDynamic from "./components/AuthorSpotlightDynamic";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImages, setHeroImages] = useState([]);

  useEffect(() => {
    async function loadBooks() {
      try {
        const booksData = await fetchAllBooks();
        const processedBooks = booksData.map(book => processBookData(book));
        setBooks(processedBooks);
      } catch (error) {
        console.error("Error loading books:", error);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  useEffect(() => {
    async function loadHeroSections() {
      try {
        const heroSections = await fetchHeroSections();
        const apiImages = processHeroSectionImages(heroSections);
        setHeroImages(apiImages);
      } catch (error) {
        console.error("Error loading hero sections:", error);
        setHeroImages([]);
      }
    }
    loadHeroSections();
  }, []);

  function getUniqueTitlesCount(books) {
    const uniqueTitles = new Set();
    books.forEach((book) => {
      // Normalize the title by removing (PAPERBACK) or (HARDCOVER) from the end
      const normalizedTitle = book.title
        .replace(/\s\((PAPERBACK|Hardback)\)$/i, "")
        .trim();
      uniqueTitles.add(normalizedTitle);
    });
    return uniqueTitles.size;
  }

  function getUniqueTitlesAndBooks(books) {
    const uniqueBooks = {};

    books.forEach((book) => {
      // Normalize the title by removing (PAPERBACK) or (HARDCOVER)
      const normalizedTitle = book.title
        .replace(/\s\((PAPERBACK|Hardback)\)$/i, "")
        .trim();

      if (!uniqueBooks[normalizedTitle]) {
        uniqueBooks[normalizedTitle] = book;
      } else {
        // If already present, replace it with the HARDCOVER version if current is HARDCOVER
        if (/\(Hardback\)$/i.test(book.title)) {
          uniqueBooks[normalizedTitle] = book;
        }
      }
    });

    return Object.values(uniqueBooks); // Return array of unique books
  }

  // Helper function to group books by publishYear
  const booksByYear = books.reduce((acc, book) => {
    if (!acc[book.publish_year]) {
      acc[book.publish_year] = [];
    }
    acc[book.publish_year].push(book);
    return acc;
  }, {});

  // Helper function to get the number of distinct authors for each year
  const getAuthorsCount = (booksArray) => {
    const authors = new Set();

    booksArray.forEach((book) => {
      if (Array.isArray(book.authors)) {
        book.authors.forEach(author => {
          if (author && author.author_name && author.author_name.trim() !== '' && author.author_name !== 'author black') {
            authors.add(author.author_name);
          }
        });
      } else if (book.author && book.author.author_name && book.author.author_name.trim() !== '' && book.author.author_name !== 'author black') {
        authors.add(book.author.author_name);
      }
    });

    return authors.size;
  };

  // Helper function to get the number of distinct languages for each year
  const getLanguagesCount = (booksArray) => {
    const languages = new Set();

    booksArray.forEach((book) => {
      if (book.language && book.language.trim() !== "") {
        languages.add(book.language);
      }
    });
    return languages.size;
  };

  const sortedYears = Object.keys(booksByYear).sort();

  // Helper function to adjust book categorization based on month
  const adjustedBooksByYear = {};

  // Categorize books correctly based on publish year and month
  books.forEach((book) => {
    let year = parseInt(book.publish_year, 10);
    let month = "april"; // Default month
    
    // Handle different possible formats of publish_month
    if (book.publish_month) {
      if (typeof book.publish_month === 'string') {
        month = book.publish_month.toLowerCase();
      } else if (typeof book.publish_month === 'number') {
        // Convert month number to name
        const monthNames = [
          'january', 'february', 'march', 'april', 'may', 'june',
          'july', 'august', 'september', 'october', 'november', 'december'
        ];
        month = monthNames[book.publish_month - 1] || 'april';
      }
    }
  
    // If January, February, or March, move it back by one year
    if (month === "january" || month === "february" || month === "march") {
      year -= 1;
    }
  
    if (!adjustedBooksByYear[year]) {
      adjustedBooksByYear[year] = [];
    }
  
    adjustedBooksByYear[year].push(book);
  });  

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="relative wrapper homepage">
          <HelmetProvider>
            <Helmet>
              <title>BluOne Ink - Publishing, with a Purpose</title>
              <meta
                name="description"
                content="Let's celebrate India's heritage and build a platform for thinkers, scholars, writers, and philosophers together through excellence in publishing."
              />
            </Helmet>
          </HelmetProvider>
          <div className="main mt-10">
            <section className="slider relative z-1">
              {/* <BannerSlider /> */}
              {heroImages.length > 0 && (
                <BannerCarousel images={heroImages} />
              )}
            </section>
          </div>

          <div className="bg-[#ffffff] w-full relative z-[11]">
            {/* <div className="w-full h-full bg-[#1084090D] pt-[60px] pb-[80px] bookpart relative z-[111]">
              <div className="container mx-auto">
                <section className="book_by_year ">
                  <i>
                    <h6 className="text-center font-semibold">
                      In 2021, the year BluOne Ink was founded, we published{" "}
                      {booksByYear[2021]
                        ? getUniqueTitlesCount(booksByYear[2021])
                        : 0}{" "}
                      titles.
                      <br />
                      This year, we aim to cross 100 published titles.
                    </h6>
                  </i>

                  {Object.keys(adjustedBooksByYear).map((year) => {
                    const nextYear = (parseInt(year) + 1).toString();
                    const displayYear = `${year}-${nextYear}`;
                    const booksForYear = adjustedBooksByYear[year] || [];
                    
                    // Skip rendering if no books exist for this year
                    if (booksForYear.length === 0) return null;  

                    const uniqueBooksForYear = getUniqueTitlesAndBooks(booksForYear);
                    const languagesCount = getLanguagesCount(booksForYear); 

                    return (
                      <div key={year}>
                        <div className="flex justify-center mt-[54px]">
                          <Image src={inksingleicon} width={30} height={30} />
                        </div>
                        <div className="flex flex-col mt-[26px]">
                          <span className="text-center text-[#241B6D] spanfont">
                            {displayYear}
                          </span>
                          <i className="mt-[4px]">
                            <h6 className="text-center font-normal">
                              {uniqueBooksForYear.length} titles, {languagesCount}{" "}
                              {languagesCount === 1 ? "language" : "languages"},{" "}
                              {getAuthorsCount(booksForYear)} authors
                            </h6>
                          </i>

                          <div
                            className={`items_main flex flex-wrap gap-2 justify-center mt-[30px] ${
                              year === "2022" ? "max-w-3xl mx-auto" : ""
                            }`}
                          >
                            {uniqueBooksForYear.map((book) => (
                              <div className="item_card" key={book.id}>
                                <Link href={`./books/${book.slug}`} style={{ textDecoration: "none" }}>
                                  <img src={book.book_image} alt={book.title} className="cover_img" />
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </section>
              </div>
            </div> */}

            <section className="bg-white">
              <BookDiscovery books={books} />
            </section>

            {/* <AuthorSpotlightDynamic /> */}
            <AuthorSpotlightDynamic
              authorSlugs={[
              "ami-ganatra",
              "anand-ranganathan",
              "vivek-ranjan-agnihotri"
              ]}
            />

            {/* <Spotlight /> */}

            <section className="container event mt-[80px] pb-[60px]">
              <div className="flex items-center justify-center gap-2 pb-6 ">
                <Image
                  src={inkdouble1}
                  width={55}
                  height={55}
                  className=""
                ></Image>
                <i>
                  <h3 className="text-center text-lg lg:text-3xl font-semibold">
                    Events we've been a part of
                  </h3>
                </i>
                <Image
                  src={inkdouble2}
                  width={55}
                  height={55}
                  className=""
                ></Image>
              </div>

              <div className="w-full lg:max-w-[650px] mx-auto">
                <div className="flex items-center gap-8 lg:gap-24 justify-center">
                  {/* JLF */}
                  <div className="relative overflow-hidden flex justify-center">
                    <Link
                      href="https://jaipurliteraturefestival.org/"
                      target="blank"
                    >
                      <Image
                        src={jlf}
                        alt="jlf"
                        width={500}
                        height={500}
                        layout="intrinsic"
                        className=""
                      />
                    </Link>
                  </div>

                  {/* PLF */}
                  <div className="relative overflow-hidden flex justify-center">
                    <Link href="http://pondylitfest.com/" target="blank">
                      <Image
                        src={plf}
                        alt="plf"
                        width={600}
                        height={600}
                        className=""
                      />
                    </Link>
                  </div>

                  {/* The Jaipur */}
                  <div className="relative overflow-hidden flex justify-center">
                    <Link
                      href="https://www.thejaipurdialogues.com/"
                      target="blank"
                    >
                      <Image
                        src={thejaipur}
                        alt="the jaipur"
                        width={650}
                        height={650}
                        layout="intrinsic"
                        className=""
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
