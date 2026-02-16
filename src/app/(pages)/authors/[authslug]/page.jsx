"use client";
import { useState, useEffect } from "react";
import inkdouble1 from "@/app/assests/image/inkdouble1.svg";
import inkdouble2 from "@/app/assests/image/inkdouble2.svg";
import Image from "next/image";
import bgauthor from "@/app/assests/image/authors-back.svg";
import Loader from "@/app/components/Loader";
import Link from "next/link";
import AuthorBooksCards from "../authorBooksCards";
import { Helmet } from "react-helmet";
import {FaLinkedinIn,FaFacebookF,FaInstagram,FaYoutube,FaTwitter,} from "react-icons/fa";
import SpotlightMedia from "@/app/components/SpotlightMedia";
import Spotlight from "@/app/components/Spotlight";
import { fetchSpotlights } from "@/app/API/spotlightApi";
import { getApiUrl } from "@/lib/apiConfig";


const Page = ({ params }) => {
  const { authslug } = params;

  const [authorInfo, setAuthorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasSpotlights, setHasSpotlights] = useState(false);

  const defaultImage = "/author-defaultimages.png";

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await fetch(
          getApiUrl(`/api/public/authors/${authslug}`)
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Author data:", data); // Debug log
        
        if (!data || !data.name) {
          throw new Error("Invalid author data received");
        }

        // Fetch all books to find books where this author is either the main author or a writer
        const booksResponse = await fetch(getApiUrl("/api/public/books") + "?limit=500");
        if (!booksResponse.ok) {
          throw new Error(`HTTP error! status: ${booksResponse.status}`);
        }
        const allBooks = await booksResponse.json();

        // Filter books where this author is either the main author or a writer
        const authorBooks = allBooks.filter(book => {
          const isMainAuthor = book.author?.id === data.id;
          const isWriter = book.writers?.some(writer => writer.id === data.id);
          return isMainAuthor || isWriter;
        });

        setAuthorInfo({
          id: data.id,
          author_name: data.name,
          authslug: data.slug,
          image: data.imageUrl,
          authorDescription: data.description,
          authorSocial: data.socialMedia ? Object.values(data.socialMedia) : [],
          books: authorBooks || [],
        });

        // Check if author has spotlights
        try {
          const spotlights = await fetchSpotlights({ 
            authorSlug: data.slug, 
            isActive: true 
          });
          setHasSpotlights(spotlights && spotlights.length > 0);
        } catch (spotlightError) {
          console.error("Error checking spotlights:", spotlightError);
          setHasSpotlights(false);
        }
      } catch (error) {
        console.error("Error fetching author data:", error);
        setAuthorInfo(null);
      } finally {
        setLoading(false);
      }
    };

    if (authslug) {
      fetchAuthorData();
    }
  }, [authslug]);

  if (loading) {
    return <Loader />;
  }

  if (!authorInfo) {
    return <div>Author not found.</div>;
  }

  // Meta title and description and canonical
  const pageTitle = `${authorInfo.author_name} | BluOne Ink Author`;
  const pageDescription = `Ink Author`;
  const canonicalUrl = `https://www.bluone.ink/authors/${authslug}`;

  // Short and full description logic
  const descriptionWords = authorInfo.authorDescription.split(" ");
  const shortDescription =
    descriptionWords.slice(0, 80).join(" ") +
    (descriptionWords.length > 80 ? "" : "");
  const fullDescription = authorInfo.authorDescription;

  return (
    <>
      <main className="wrapper pt-0 pb-10">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <link rel="canonical" href={canonicalUrl} />
        </Helmet>

        {/* Page Container */}
        <div className="container pt-20">
          <div className="relative pb-20">
            <div className="absolute top-0 left-0 right-0 pb-20 z-[10]">
              <img
                className="m-auto p-1 aspect-square object-cover border-2 border-dashed border-[#241B6D] rounded-full"
                src={authorInfo.image || defaultImage}
                alt="Author"
                width={300}
                height={250}
              />
            </div>
          </div>

          {/* Author Details Section */}
          <div
            className="author-details-container mx-auto p-10 rounded-2xl w-full lg:w-[65%] bg-cover bg-center mt-20"
            style={{ position: "relative" }}
          >
            <Image
              src={bgauthor}
              alt="Background"
              layout="fill"
              objectFit="cover"
              objectPosition="top"
              borderRadius="30px"
            />
            <div
              className="text-center"
              style={{ position: "relative", zIndex: 1 }}
            >
              <h4 className="mt-20 pt-10 text-[28px] lg:text-4xl mb-5">
                {authorInfo.author_name}
              </h4>

              {/* Conditionally render description */}
              <p className="text-start pt-4 pb-4 ">
                {isExpanded ? fullDescription : shortDescription}
                &nbsp;
                {descriptionWords.length > 80 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[#0D1928] underline font-medium focus:outline-none"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </p>

              {/* Author's Social Media Links */}
              <ul className="flex flex-wrap justify-center gap-6 pb-6">
              {authorInfo.authorSocial.map((social, index) => {
                let Icon = null;

                if (social.includes("linkedin")) Icon = FaLinkedinIn;
                else if (social.includes("facebook")) Icon = FaFacebookF;
                else if (social.includes("instagram")) Icon = FaInstagram;
                else if (social.includes("youtube")) Icon = FaYoutube;
                else if (social.includes("twitter") || social.includes("x.com"))
                  Icon = FaTwitter;

                if (!Icon) return null;

                return (
                  <li key={index} className="list-none">
                    <a
                      href={social}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-[#0D1928] text-[#0D1928]
                                hover:bg-[#0D1928] hover:text-white transition-all duration-300"
                    >
                      <Icon size={18} />
                    </a>
                  </li>
                );
              })}
            </ul>
            </div>
          </div>

          {/* Author's Books Section */}
          <div className="books-section w-full pt-20">
            <div className="flex items-center gap-2 justify-center pb-6 pt-6">
              <Image
                src={inkdouble1}
                width={55}
                height={55}
                alt="inkdouble1"
              />
              <i>
                <h3 className="font-semibold text-base md:text-3xl text-center">
                  {authorInfo.books.length >= 2
                    ? `${authorInfo.author_name}'s books published by BluOne Ink`
                    : `${authorInfo.author_name}'s book published by BluOne Ink`}
                </h3>
              </i>
              <Image
                src={inkdouble2}
                width={55}
                height={55}
                alt="inkdouble2"
              />
            </div>

            <div className="wrapper mt-12 flex flex-wrap justify-center">
              {authorInfo.books.length > 0 ? (
                authorInfo.books.map((book, i) => {
                  // Get all authors for this book
                  const allAuthors = [
                    book.author,
                    ...(book.writers || [])
                  ].filter(Boolean).map(author => author.name).join(', ');

                  return (
                    <div
                      key={i}
                      className="p-4 mb-4 hover:shadow-md input-border border-[#ffffff00] hover:border-[#BABABA] rounded-md md:w-1/2 lg:w-1/4"
                    >
                      <Link href={`/books/${book.slug}`} style={{ textDecoration: "none" }}>
                        <AuthorBooksCards
                          title={book.title}
                          thumbnailUrl={book.thumbnailUrl}
                          publishYear={book.publishYear}
                          authorName={allAuthors}
                          imageContainerClass="h-[400px] lg:h-[450px]"
                        />
                      </Link>
                    </div>
                  );
                })
              ) : (
                <p>No related books found for this author.</p>
              )}
            </div>
          </div>
        </div>

        {/* Spotlight Section - Only render if author has spotlights */}
        {hasSpotlights && <Spotlight authorSlug={authslug} />}
      </main>
    </>
  );
};

export default Page;
