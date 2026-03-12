"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa";
import { fetchAuthorsBySlugs, processAuthorData } from "@/app/API/authorsApi";
import CurveTop from "@/app/assests/image/aboutauthorbg.png";
import inkdouble1 from "@/app/assests/image/inkdouble1.svg";
import inkdouble2 from "@/app/assests/image/inkdouble2.svg";
const AUTHOR_SLUGS = [
  "ami-ganatra",
  "anand-ranganathan",
  "vivek-ranjan-agnihotri"
];
export default function AuthorSpotlightDynamic() {
  const authorSlugs = AUTHOR_SLUGS;
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    async function loadAuthors() {
      try {
        if (!authorSlugs.length) {
          setAuthors([]);
          return;
        }
        const authorsData = await fetchAuthorsBySlugs(authorSlugs);
        setAuthors(authorsData);
        setCurrentIndex(0);

      } catch (error) {
        console.error("Error loading authors:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAuthors();
  }, []);

  const nextAuthor = () => {
    setFadeOut(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % authors.length);
      setFadeOut(false);
    }, 300);
  };

  const prevAuthor = () => {
    setFadeOut(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + authors.length) % authors.length);
      setFadeOut(false);
    }, 300);
  };

  const goToAuthor = (index) => {
    setFadeOut(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setFadeOut(false);
    }, 300);
  };

  // 🔹 Auto slide
  useEffect(() => {
    if (authors.length <= 1) return;
    const timer = setInterval(nextAuthor, 7000);
    return () => clearInterval(timer);
  }, [currentIndex, authors.length]);

  // 🔹 Reset read more on change
  useEffect(() => {
    setIsExpanded(false);
    setFadeOut(false);
  }, [currentIndex]);

  if (loading) {
    return (
      <section className="container mx-auto text-center py-10 mt-20 lg:w-[70%]">
        <div className="flex justify-center gap-2 pb-6">
          <Image src={inkdouble1} width={55} height={55} alt="" />
          <h3 className="text-lg lg:text-3xl font-semibold">
            Author Spotlight
          </h3>
          <Image src={inkdouble2} width={55} height={55} alt="" />
        </div>
        <div>Loading...</div>
      </section>
    );
  }

  if (authors.length === 0) return null;

  const currentAuthor = authors[currentIndex];

  const fullDescription =
    currentAuthor.description ||
    currentAuthor.bio ||
    currentAuthor.about ||
    currentAuthor.biography ||
    currentAuthor.summary ||
    "";

  const words = fullDescription.split(" ").filter(Boolean);
  const shortDescription = words.slice(0, 80).join(" ");
  const shouldShowReadMore = words.length > 80;

  return (
  <section
    id="about-author"
    className="container mx-auto text-center py-10 mt-20 pt-0 p-0 lg:w-[70%] lg:mx-auto relative"
  >
    {/* Heading */}
    <div className="flex items-center justify-center gap-2 pb-6">
      <Image src={inkdouble1} width={55} height={55} alt="" />
      <i>
        <h3 className="text-center text-lg lg:text-3xl font-semibold">
          Author Spotlight
        </h3>
      </i>
      <Image src={inkdouble2} width={55} height={55} alt="" />
    </div>

    <div className="relative">
      {/* Slider Card */}
      <div
        className={`about-author author-details-container mx-auto p-10 pt-5 rounded-2xl w-full lg:w-[85%] bg-[#FF81001A] transition-opacity duration-500 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Curve */}
        <div className="curve_img">
          <Image src={CurveTop} alt="Curve Top" />
        </div>

        {/* Author Image */}
        <div className="flex justify-center mb-2">
          <div className="z-[10] border-[#FF8100] border-4 rounded-full">
            <Image
              src={currentAuthor.imageUrl}
              alt={currentAuthor.name}
              width={150}
              height={150}
              className="rounded-full w-[100px] h-[100px] lg:w-[150px] lg:h-[150px] object-cover"
            />
          </div>
        </div>

        <div className="lg:p-8 pt-10 mx-auto">
          <div className="relative z-[10]">
            <i>
              <h3 className="font-medium text-3xl mb-4">
                {currentAuthor.name}
              </h3>
            </i>

            {/* Description */}
            {fullDescription ? (
              <p className="text-gray-700 text-center mb-4 text-lg leading-relaxed break-words">
                {isExpanded ? fullDescription : shortDescription}
                {shouldShowReadMore && (
                  <>
                    &nbsp;
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-[#007DD7] underline font-medium hover:text-[#005fa3]"
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  </>
                )}
              </p>
            ) : (
              <p className="text-gray-500 italic">
                Description not available.
              </p>
            )}

            {/* Social Links (RESTORED) */}
            {(currentAuthor.socialLinks?.instagram ||
              currentAuthor.socialLinks?.linkedin ||
              currentAuthor.socialLinks?.twitter ||
              currentAuthor.socialLinks?.facebook ||
              currentAuthor.socialLinks?.youtube ||
              currentAuthor.socialLinks?.website) && (
              <ul className="flex flex-wrap justify-center gap-6 pb-6">
                {currentAuthor.socialLinks?.twitter && (
                  <li>
                    <a href={currentAuthor.socialLinks.twitter} target="_blank">
                      <FaTwitter />
                    </a>
                  </li>
                )}
                {currentAuthor.socialLinks?.instagram && (
                  <li>
                    <a href={currentAuthor.socialLinks.instagram} target="_blank">
                      <FaInstagram />
                    </a>
                  </li>
                )}
                {currentAuthor.socialLinks?.linkedin && (
                  <li>
                    <a href={currentAuthor.socialLinks.linkedin} target="_blank">
                      <FaLinkedin />
                    </a>
                  </li>
                )}
                {currentAuthor.socialLinks?.facebook && (
                  <li>
                    <a href={currentAuthor.socialLinks.facebook} target="_blank">
                      <FaFacebook />
                    </a>
                  </li>
                )}
                {currentAuthor.socialLinks?.youtube && (
                  <li>
                    <a href={currentAuthor.socialLinks.youtube} target="_blank">
                      <FaYoutube />
                    </a>
                  </li>
                )}
                {currentAuthor.socialLinks?.website && (
                  <li>
                    <a href={currentAuthor.socialLinks.website} target="_blank">
                      <FaGlobe />
                    </a>
                  </li>
                )}
              </ul>
            )}

            <Link
              href={`/authors/${currentAuthor.slug}`}
              className="text-blue-500 underline"
            >
              Visit the Author Page
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows (RESTORED POSITION) */}
      {authors.length > 1 && (
        <>
          <button
            onClick={prevAuthor}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#FF8100] text-white flex items-center justify-center shadow-lg"
          >
            <FiChevronLeft />
          </button>

          <button
            onClick={nextAuthor}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#FF8100] text-white flex items-center justify-center shadow-lg"
          >
            <FiChevronRight />
          </button>

          {/* Dots (RESTORED) */}
          <div className="flex justify-center gap-2 mt-6">
            {authors.map((_, index) => (
              <button
                key={index}
                onClick={() => goToAuthor(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-[#FF8100] w-6"
                    : "bg-gray-400 w-2"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  </section>
);
}