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
  const [loading, setLoading] = useState(true);
  const [heroImages, setHeroImages] = useState([]);

  useEffect(() => {
    async function loadHeroSections() {
      try {
        const heroSections = await fetchHeroSections();
        const apiImages = processHeroSectionImages(heroSections);
        setHeroImages(apiImages);
      } catch (error) {
        console.error("Error loading hero sections:", error);
        setHeroImages([]);
      }finally{
        setLoading(false);
      }
    }
    loadHeroSections();
  }, []);
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
            <section className="bg-white">
              <BookDiscovery />
            </section>

            {/* <AuthorSpotlightDynamic /> */}
            <AuthorSpotlightDynamic
              // authorSlugs={[
              // "ami-ganatra",
              // "anand-ranganathan",
              // "vivek-ranjan-agnihotri"
              // ]}
            />

            <section className="container event mt-[80px] pb-[60px]">
              <div className="flex items-center justify-center gap-2 pb-6 ">
                <Image
                  src={inkdouble1}
                  alt="Decorative divider icon"
                  width={55}
                  height={55}
                  className="h-auto w-auto"
                ></Image>
                <i>
                  <h3 className="text-center text-lg lg:text-3xl font-semibold">
                    Events we've been a part of
                  </h3>
                </i>
                <Image
                  src={inkdouble2}
                  alt="Decorative divider icon"
                  width={55}
                  height={55}
                  className="h-auto w-auto"
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
                        className="h-auto w-auto"
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
                       className="h-auto w-auto"
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
                        className="h-auto w-auto"
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
