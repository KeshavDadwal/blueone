"use client";

import { useState, useEffect } from "react";
import Loader from "@/app/components/Loader";
import Link from "next/link";
import { Helmet } from "react-helmet";

const Page = ({ params }) => {
  const galleryslug = decodeURIComponent(params.galleryslug);

  // API URL dynamic slug ke sath
  const apiUrl = `https://dashboard.bluone.ink/api/public/gallery/${galleryslug}`;

  const [galleryData, setGalleryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const defaultImage = "https://via.placeholder.com/250x400.png?text=No+Image+Available";

  // Fetch API data
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setGalleryData(data);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!galleryData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Failed to load gallery data.</p>
      </div>
    );
  }

  const pageTitle = `${galleryData.title || "Gallery"} | BluOne Ink Publishing`;
  const pageDescription = "Explore our gallery.";
  const canonicalUrl = `https://www.bluone.ink/resources/events/${galleryslug}`;

  const imageList = galleryData.images?.map((img) => img.url) || [];
  const validImageList = imageList.length ? imageList : [defaultImage];

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === validImageList.length - 1 ? 0 : prevIndex + 1
    );
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? validImageList.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <main id="gallery-content" className="wrapper pt-20 mt-0 lg:pb-20 relative top_bg_gradient">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <link rel="canonical" href={canonicalUrl} />
        </Helmet>

        <section>
          <div className="container relative z-10">
            <div className="gallery-wrapper p-10 pt-6 lg:w-2/3 mx-auto">
              {/* Back Link */}
              <Link href="/resources/gallery">
                <h6 className="text-[16px] font-medium text-center text-[#007DD7]">
                  Back to All Albums
                </h6>
              </Link>

              {/* Gallery Title */}
              <h1 className="lg:text-[40px] text-[28px] text-center mb-6 pt-6 font-medium">
                {galleryData.title || "Gallery"}
              </h1>

              {/* Date */}
              <h6 className="text-[16px] font-barlow text-center uppercase font-normal">
                {galleryData.date
                  ? new Intl.DateTimeFormat("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(galleryData.date))
                  : "Not available"}
              </h6>

              {/* Event Details */}
              <div
                className="font-ibm text-center pt-6"
                dangerouslySetInnerHTML={{ __html: galleryData.description }}
              />
            </div>

            {/* Masonry Grid for Gallery Images */}
            <ul
              className={`${
                validImageList.length <= 1 ? "columns-1" : "columns-2"
              } gap-4 space-y-4 mx-auto p-5`}
            >
              {validImageList.map((image, index) => (
                <li
                  key={index}
                  className="break-inside-avoid"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image}
                    alt={`Gallery Image ${index + 1}`}
                    className="w-full h-auto object-cover rounded-none cursor-pointer"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Lightbox */}
          {isLightboxOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
              onClick={closeLightbox}
            >
              <div
                className="relative w-full max-w-3xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 text-white text-xl z-70"
                  onClick={closeLightbox}
                >
                  ✕
                </button>

                {/* Image Display */}
                <img
                  src={validImageList[currentImageIndex]}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="w-full object-contain rounded"
                />

                {/* Previous Button */}
                <button
                  className="absolute top-1/2 left-4 sm:left-2 transform -translate-y-1/2 text-white text-2xl sm:text-3xl z-70 bg-opacity-50 p-2 rounded-full"
                  onClick={showPreviousImage}
                >
                  ‹
                </button>

                {/* Next Button */}
                <button
                  className="absolute top-1/2 right-4 sm:right-2 transform -translate-y-1/2 text-white text-2xl sm:text-3xl z-70 bg-opacity-50 p-2 rounded-full"
                  onClick={showNextImage}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Page;
