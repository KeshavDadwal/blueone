import Image from "next/image";
import jlf from "@/app/assests/image/jlf.png";
import plf from "@/app/assests/image/plf.png";
import thejaipur from "@/app/assests/image/thejaipur.png";
import Link from "next/link";
import inkdouble1 from "@/app/assests/image/inkdouble1.svg";
import inkdouble2 from "@/app/assests/image/inkdouble2.svg";
import { fetchHeroSections, processHeroSectionImages } from "./API/heroSectionApi";
import { fetchBooksByCategory } from "./API/booksListApi";
import BookDiscovery from "./components/BookDiscovery";
import BannerCarousel from "./components/BannerCarousel";
import AuthorSpotlightDynamic from "./components/AuthorSpotlightDynamic";
import { fetchAuthorsBySlugs, processAuthorData } from "./API/authorsApi";

export const metadata = {
  title: "BluOne Ink - Publishing, with a Purpose",
  description:
    "Let's celebrate India's heritage and build a platform for thinkers, scholars, writers, and philosophers together through excellence in publishing.",
};

export default async function Home() {
  let heroImages = [];
  let booksByCategory = {
    "Bestsellers": [],
    "New-Releases": [],
    "Coming-Soon": [],
  };
  let spotlightAuthors = [];

  try {
    const heroSections = await fetchHeroSections();
    heroImages = processHeroSectionImages(heroSections);
  } catch (error) {
    heroImages = [];
  }

  try {
    booksByCategory = await fetchBooksByCategory();
  } catch (error) {
    // keep default empty categories
  }

  try {
    const AUTHOR_SLUGS = [
      "ami-ganatra",
      "anand-ranganathan",
      "vivek-ranjan-agnihotri",
    ];

    const rawAuthors = await fetchAuthorsBySlugs(AUTHOR_SLUGS);
    spotlightAuthors = Array.isArray(rawAuthors)
      ? rawAuthors.map((a) => processAuthorData(a))
      : [];
  } catch (error) {
    spotlightAuthors = [];
  }

  return (
    <div className="relative wrapper homepage">
      <div className="main mt-10">
        <section className="slider relative z-1">
          {heroImages.length > 0 && <BannerCarousel images={heroImages} />}
        </section>
      </div>

      <div className="bg-[#ffffff] w-full relative z-[11]">
        <section className="bg-white">
          <BookDiscovery booksByCategory={booksByCategory} />
        </section>

        <AuthorSpotlightDynamic authors={spotlightAuthors} />

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
  );
}
