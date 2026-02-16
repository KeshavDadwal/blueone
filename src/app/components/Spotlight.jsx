"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchSpotlights, processSpotlightData } from "@/app/API/spotlightApi";
import inkdouble1 from "@/app/assests/image/inkdouble1.svg";
import inkdouble2 from "@/app/assests/image/inkdouble2.svg";
import Modal from "./Modal";

export default function Spotlight({ authorSlug = null, bookSlug = null }) {
  const [spotlights, setSpotlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "" });
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    async function loadSpotlights() {
      try {
        const filters = { isActive: true };
        // If authorSlug is provided, filter by author
        if (authorSlug) {
          filters.authorSlug = authorSlug;
        }
        // If bookSlug is provided, filter by book
        if (bookSlug) {
          filters.bookSlug = bookSlug;
        }
        const data = await fetchSpotlights(filters);
        const processed = data.map(processSpotlightData);
        setSpotlights(processed);
      } catch (error) {
        console.error("Error loading spotlights:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSpotlights();
  }, [authorSlug, bookSlug]);

  // Auto-advance spotlight every 7 seconds
  useEffect(() => {
    if (spotlights.length <= 1) return;

    const timer = setInterval(() => {
      setFeaturedIndex((prevIndex) => (prevIndex + 1) % spotlights.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [spotlights.length, featuredIndex]);

  if (loading) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (spotlights.length === 0) {
    return null;
  }

  // Featured spotlight (based on selected index)
  const featured = spotlights[featuredIndex];

  // Additional spotlights for the bottom row - show items in order after featured
  // This creates a circular effect where featured moves to right, leftmost moves to top
  const additionalSpotlights = [];
  for (let i = 1; i <= Math.min(5, spotlights.length - 1); i++) {
    const index = (featuredIndex + i) % spotlights.length;
    additionalSpotlights.push({
      ...spotlights[index],
      originalIndex: index
    });
  }

  // Handle spotlight change
  const handleSpotlightChange = (index) => {
    setFeaturedIndex(index);
  };

  // Drag handlers for carousel
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const carousel = e.currentTarget;
    setStartX(e.pageX - carousel.offsetLeft);
    setScrollLeft(carousel.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const carousel = e.currentTarget;
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e) => {
    const carousel = e.currentTarget;
    setStartX(e.touches[0].pageX - carousel.offsetLeft);
    setScrollLeft(carousel.scrollLeft);
  };

  const handleTouchMove = (e) => {
    const carousel = e.currentTarget;
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="spotlight-section w-full bg-[rgba(255,129,0,0.1)] py-14 mt-10">
      <div className="w-full max-w-7xl mx-auto px-2 md:px-3">
        {/* Section Header */}
        <div className="flex items-center justify-center gap-2 pb-10">
          <Image src={inkdouble1} width={55} height={55} alt="" />
          <i>
            <h3 className="text-center text-lg lg:text-3xl font-semibold">
              Spotlight
              
            </h3>
          </i>
          <Image src={inkdouble2} width={55} height={55} alt="" />
        </div>

        {/* Featured Spotlight */}
        <div className="overflow-hidden mb-12 w-full">
          <div
            key={featuredIndex}
            className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full animate-slide-in"
          >
            {/* Featured Video/Image */}
            <div className="w-full lg:w-1/2">
              <SpotlightVideoCard spotlight={featured} featured />
            </div>

            {/* Featured Content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <i>
              <h3 className="text-[#0d1928] text-2xl lg:text-4xl font-semibold italic mb-4 break-words">
                {featured.title || "Video Title goes here"}
              </h3>
            </i>
            <div className="relative">
              <div
                className="text-[#0d1928] text-base lg:text-xl leading-relaxed break-words overflow-wrap-anywhere line-clamp-4"
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                dangerouslySetInnerHTML={{
                  __html:
                    featured.text ||
                    "Video Description goes here. Explore our exclusive interviews and highlights..."
                }}
              />
              {featured.text && (
                <button
                  onClick={() => {
                    setModalContent({
                      title: featured.title || "Video Title goes here",
                      text: featured.text
                    });
                    setIsModalOpen(true);
                  }}
                  className="mt-3 text-[#FF8100] font-semibold hover:text-[#FF9500] transition-colors underline"
                >
                  Read More
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      </div>

      {/* Additional Spotlights Row - White Strip Edge to Edge */}
      {additionalSpotlights.length > 0 && (
        <div className="w-screen relative left-[50%] right-[50%] -mx-[50vw] bg-white py-6 mt-8">
          <div
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide justify-center px-4"
            style={{
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {additionalSpotlights.map((spotlight) => {
              return (
                <div key={spotlight.id} className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px] lg:w-[300px]">
                  <SpotlightCard
                    spotlight={spotlight}
                    onClick={() => !isDragging && handleSpotlightChange(spotlight.originalIndex)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal for full text */}
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          title={modalContent.title}
        >
          <div
            className="text-[#0d1928] text-base lg:text-lg leading-relaxed break-words overflow-wrap-anywhere font-ibm"
            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            dangerouslySetInnerHTML={{
              __html: modalContent.text
            }}
          />
        </Modal>
      )}
    </section>
  );
}

// Video card component for featured spotlight
function SpotlightVideoCard({ spotlight, featured = false }) {
  const isVideo = spotlight.isVideo || spotlight.youtubeId;
  const videoUrl = spotlight.link || (spotlight.youtubeId ? `https://www.youtube.com/watch?v=${spotlight.youtubeId}` : null);

  const content = (
    <>
      {/* Thumbnail Image */}
      <div className="relative w-full h-full bg-gray-200">
        <img
          src={spotlight.thumbnailUrl || spotlight.mediaUrl || "/placeholder-video.jpg"}
          alt={spotlight.title || "Spotlight"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Play Button Overlay - Only for videos */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-black bg-opacity-70 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg
              className="w-8 h-8 lg:w-10 lg:h-10 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </>
  );

  // If it's a video with a link, make it clickable
  if (isVideo && videoUrl) {
    return (
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block w-full group overflow-hidden rounded-lg"
        style={{ aspectRatio: featured ? "16/9" : "16/9" }}
      >
        {content}
      </a>
    );
  }

  // Otherwise, just display the image
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg"
      style={{ aspectRatio: featured ? "16/9" : "16/9" }}
    >
      {content}
    </div>
  );
}

// Card component for additional spotlights
function SpotlightCard({ spotlight, onClick }) {
  const isVideo = spotlight.isVideo || spotlight.youtubeId;

  return (
    <div
      className="bg-white overflow-hidden transition-all duration-300 cursor-pointer border-transparent hover:border-[#FF8100]"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative w-full group" style={{ aspectRatio: "16/9" }}>
        <div className="relative w-full h-full bg-gray-200">
          <img
            src={spotlight.thumbnailUrl || spotlight.mediaUrl || "/placeholder-video.jpg"}
            alt={spotlight.title || "Spotlight"}
            className="w-full h-full object-cover transition-transform duration-300"
          />
        </div>

        {/* Play Button Overlay - Only for videos */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all">
            <div className="w-10 h-10 bg-black bg-opacity-70 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                className="w-5 h-5 text-white ml-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="p-3">
        <p className="text-sm text-[#0d1928] italic line-clamp-3 break-words group-hover:text-[#FF8100] transition-colors" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          {spotlight.title || "Spotlight content"}
        </p>
      </div>
    </div>
  );
}
