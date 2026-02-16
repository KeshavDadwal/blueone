"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import jlf from "@/app/assests/image/jlf.png";
import plf from "@/app/assests/image/plf.png";
import thejaipur from "@/app/assests/image/thejaipur.png";
import inkdouble1 from "@/app/assests/image/inkdouble1.svg";
import inkdouble2 from "@/app/assests/image/inkdouble2.svg";
import Loader from "@/app/components/Loader";
import BannerSlider from "@/app/components/BannerSlider";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet";

export default function AboutUs() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="relative w-full overflow-hidden mt-5">
      <HelmetProvider>
        <Helmet>
          <title>About Us | BluOne Ink</title>
          <meta
            name="description"
            content="BluOne Ink is a purpose-driven publishing house and has been part of leading literary events across India."
          />
        </Helmet>
      </HelmetProvider>

      <section className="relative z-[10] w-full">
        <BannerSlider />
      </section>

      <section className="relative z-[20] w-full -mt-[60px] lg:-mt-[120px]">
        <div className="w-full bg-white shadow-xl rounded-2xl px-6 lg:px-20 pt-12 pb-14">

          <div className="flex items-center justify-center gap-3 pb-10">
            <Image src={inkdouble1} width={55} height={55} alt="icon" />
            <h3 className="text-center text-lg lg:text-3xl font-semibold">
              Events we've been a part of
            </h3>
            <Image src={inkdouble2} width={55} height={55} alt="icon" />
          </div>

          {/* Logos */}
          <div className="w-full lg:max-w-[650px] mx-auto">
            <div className="flex items-center gap-8 lg:gap-24 justify-center">
              <div className="relative overflow-hidden flex justify-center">
              <Link
                href="https://jaipurliteraturefestival.org/"
                target="_blank"
              >
                <Image
                  src={jlf}
                  alt="Jaipur Literature Festival"
                  width={220}
                  height={220}
                />
              </Link>
              </div>

              <div className="relative overflow-hidden flex justify-center">
              <Link
                href="http://pondylitfest.com/"
                target="_blank"
              >
                <Image
                  src={plf}
                  alt="Pondy Lit Fest"
                  width={220}
                  height={220}
                />
              </Link>
              </div>
              <div className="relative overflow-hidden flex justify-center">
              <Link
                href="https://www.thejaipurdialogues.com/"
                target="_blank"
              >
                <Image
                  src={thejaipur}
                  alt="The Jaipur Dialogues"
                  width={220}
                  height={220}
                />
              </Link>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
