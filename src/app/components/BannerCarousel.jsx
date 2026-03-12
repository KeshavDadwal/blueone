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
          className="slider"
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
                    className="slide-wrapper block"
                  >
                    {imageElement}
                  </a>
                );
              }

              return (
                <Link key={slideKey} href={slide.link} className="slide-wrapper block">
                  {imageElement}
                </Link>
              );
            }

            return (
              <div key={slideKey} className="slide-wrapper">
                {imageElement}
              </div>
            );
          })}
        </div>

        {/* React Icon Arrows */}
        <button className="arrow left" onClick={prevSlide}>
          <FiChevronLeft />
        </button>
        <button className="arrow right" onClick={nextSlide}>
          <FiChevronRight />
        </button>
      </div>

      <style jsx>{`
        .banner-carousel {
          position: relative;
          width: 100%;
          max-width: 1240px;          
          height: 100%;
          overflow: hidden;
          margin:auto;
          -webkit-box-shadow: 0 8px 18px rgba(0, 0, 0, .35);
    -moz-box-shadow: 0 8px 18px rgba(0,0,0,.35);
    box-shadow: 0 8px 18px rgba(0, 0, 0, .35);

        }

        .slider {
          display: flex;
          height: 100%;
          width: 100%;
        }

        .slide-wrapper {
          min-width: 100%;
          width: 100%;
          height: 100%;
          flex-shrink: 0;
          display: block;
        }

        .slider img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.55);
          color: #fff;
          border: none;
          cursor: pointer;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
          transition: all 0.3s ease;
        }

        .arrow svg {
          font-size: 28px;
        }

        .arrow:hover {
          background: rgba(0, 0, 0, 0.75);
          transform: translateY(-50%) scale(1.08);
        }

        .arrow.left {
          left: 18px;
        }

        .arrow.right {
          right: 18px;
        }

        @media (max-width: 768px) {
          .banner-carousel {
            height: 165px;
          }

          .arrow {
            width: 44px;
            height: 44px;
          }

          .arrow svg {
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
}
