'use client';
import { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import Image from "next/image";
export default function BannerCarousel({ images = [] }) {
  // Normalize images to always be objects with image and link properties
  const normalizedImages = images.map(img => {
    if (typeof img === 'string') {
      return { image: img, link: null };
    }
    return { image: img.image || img, link: img.link || null };
  });

  const slides = normalizedImages.length > 0 ? [...normalizedImages, normalizedImages[0]] : []; // clone first
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(true);

  const nextSlide = () => {
    setTransition(true);
    setCurrent((prev) => prev + 1);
  };

  const prevSlide = () => {
    setTransition(true);
    setCurrent((prev) =>
      prev === 0 ? normalizedImages.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    if (normalizedImages.length === 0) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [current, normalizedImages.length]);

  // seamless reset to first slide
  useEffect(() => {
    if (normalizedImages.length === 0) return;
    
    if (current === normalizedImages.length) {
      setTimeout(() => {
        setTransition(false);
        setCurrent(0);
      }, 600);
    }
  }, [current, normalizedImages.length]);

  if (!images.length || !normalizedImages.length) return null;

  return (
    <>
      <div className="banner-carousel">
        <div
          className="banner-slider"
          style={{
            transform: `translateX(-${current * 100}%)`,
            transition: transition ? 'transform 0.6s ease-in-out' : 'none',
          }}
        >
          {slides.map((slide, i) => {
            const slideKey = `${slide.image}-${i}`;

            const imageElement = (
              <div className="relative w-full h-[450px] lg:h-[550px]">
               <Image
                  src={slide.image}
                  alt={`Banner ${i + 1}`}
                  fill
                  priority={i === 0}
                  quality={70}
                  sizes="(max-width: 768px) 100vw, (max-width: 1240px) 100vw, 1240px"
                  className="object-cover"
                />
              </div>
            );

            if (slide.link) {
              const isExternal =
                slide.link.startsWith("http://") ||
                slide.link.startsWith("https://");

              if (isExternal) {
                return (
                  <a
                    key={slideKey}
                    href={slide.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="banner-slide-wrapper block"
                  >
                    {imageElement}
                  </a>
                );
              }

              return (
                <Link
                  key={slideKey}
                  href={slide.link}
                  className="banner-slide-wrapper block"
                >
                  {imageElement}
                </Link>
              );
            }

            return (
              <div key={slideKey} className="banner-slide-wrapper">
                {imageElement}
              </div>
            );
          })}
        </div>

        {/* React Icon Arrows */}
        <button
          className="banner-arrow banner-arrow-left"
          onClick={prevSlide}
        >
          <FiChevronLeft />
        </button>
        <button
          className="banner-arrow banner-arrow-right"
          onClick={nextSlide}
        >
          <FiChevronRight />
        </button>
      </div>
    </>
  );
}
