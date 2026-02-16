"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Loader from "@/app/components/Loader";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet";
import {
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
  FaLocationDot,
  FaRegEnvelope,
  FaPhoneFlip
} from "react-icons/fa6";
import { FaPhone } from "react-icons/fa";

function contact() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    script.onload = () => {
      if (typeof Tally !== "undefined") {
        Tally.loadEmbeds();
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main>
          <HelmetProvider>
            <Helmet>
              <title>Contact | BluOne Ink Publishing</title>
              <meta
                name="description"
                content="Get in touch with us for your queries related to publishing your manuscript, interactions with our authors, orders, or a cup of tea or coffee."
              />
              <link
                rel="canonical"
                href="https://www.bluone.ink/contact"
              />
            </Helmet>
          </HelmetProvider>

          <div className="container mx-auto px-4 py-20 pb-0">
              {/* LEFT SIDE */}
              <div className="w-full">
                <div className="pb-[100px] max-w-[1020px] mx-auto">
                  <h1 className="font-medium pt-2 pb-6 lg:pt-[20px] lg:pb-[20px] text-center">Contact Us</h1>

                  <div className="mb-8 max-w-[700px] mx-auto">
                    <i>
                      <p className="font-ibm font-normal text-black text-center">
                        If you’d like to talk to us - whether it’s about a book idea, a query, feedback, or just to say hello - fill out the form below and we’ll reply soon. You can also email us at <a href="mailto:editors@bluone.ink">editors@bluone.ink</a>.
                      </p>
                    </i>
                  </div>

                  {/* TALLY FORM */}
                  <div className="bg-[#FFF2E5] w-full max-w-[580px] mx-auto h-full mb-[60px]">
                    <div className="w-full flex justify-center mx-auto p-6">
                      <iframe
                        data-tally-src="https://tally.so/embed/mVMWzM?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                        loading="lazy"
                        width="100%"
                        height="200"
                        title="Ink in your Inbox"
                      ></iframe>
                    </div>
                  </div>

                  <h5 className="text-center mb-5">Regional Contacts</h5>

                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 text-center">
                    <div className="border-0 lg:border-r lg:border-gray-300">
                      <p className="text-sm font-bold">North India</p>
                      <p className="text-sm">Narender Singh</p>
                      <p className="text-sm">Senior Executive, Sales</p>
                      <p className="text-sm"><a href="mailto:narender.singh@bluone.ink">narender.singh@bluone.ink</a></p>
                      <p className="text-sm"><a href="tel:+919818110264">+91 98181 10264</a></p>
                    </div>
                    <div className="border-0 lg:border-r lg:border-gray-300">
                      <p className="text-sm font-bold">South India</p>
                      <p className="text-sm">Dayanand MG</p>
                      <p className="text-sm">Senior Executive, Sales</p>
                      <p className="text-sm"><a href="mailto:dayananda@bluone.ink">dayananda@bluone.ink</a></p>
                      <p className="text-sm"><a href="tel:+917019938796">+91 70199 38796</a></p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">East & West</p>
                      <p className="text-sm">Veer Sumiet</p>
                      <p className="text-sm">Sales Manager</p>
                      <p className="text-sm"><a href="mailto:veer@bluone.ink">veer@bluone.ink</a></p>
                      <p className="text-sm"><a href="tel:+919594161555">+91 95941 61555</a></p>
                    </div>
                  </div>

                  {/* <div className="mb-8 max-w-[600px] mx-auto">
                    <i>
                      <p className="font-ibm font-normal text-black text-center">
                        The sheer delight of reading, reflecting,
                        contemplating, of sharing human experience and
                        knowledge, insight and enlightenment, timelessly,
                        agelessly — this is the incomparable magic of the
                        written word that Ink aims to bring to the world.
                      </p>
                    </i>
                  </div> */}

                  <div className="mb-8 max-w-[150px] mx-auto">
                    {/* ICON BASED SOCIAL LINKS */}
                    <ul className="flex gap-6 mb-[20px]">
                      <li>
                        <a
                          href="https://in.linkedin.com/company/bluoneink"
                          target="_blank"
                          className="text-xl hover:text-[#007DD7]"
                          aria-label="LinkedIn"
                        >
                          <FaLinkedinIn />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.instagram.com/bluone.ink/"
                          target="_blank"
                          className="text-xl hover:text-[#007DD7]"
                          aria-label="Instagram"
                        >
                          <FaInstagram />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.youtube.com/channel/UC2hOgss9-N9Yx5c3DuyIU0Q"
                          target="_blank"
                          className="text-xl hover:text-[#007DD7]"
                          aria-label="YouTube"
                        >
                          <FaYoutube />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://x.com/BluOneInk"
                          target="_blank"
                          className="text-xl hover:text-[#007DD7]"
                          aria-label="X"
                        >
                          <FaXTwitter />
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div class="flex flex-col lg:flex-row mx-auto justify-center text-center lg:text-left">
                    <div class="w-full lg:w-auto lg:pr-[9%] mb-6 lg:mb-0">
                      <p className="leading-5">
                        A-76, Sector 136 <br />
                        Noida, Uttar Pradesh, 201 305 <br />
                        <a
                          href="https://maps.app.goo.gl/ACkMv7MEujUqnHiG7"
                          target="_blank"
                          className="mt-2 inline-block w-full lg:w-auto"
                        >
                          <span className="text-[#007DD7] font-ibm flex items-center justify-center lg:justify-start">
                            <FaLocationDot className="mr-2" /> Location
                          </span>
                        </a>
                      </p>
                    </div>

                    <div class="w-full lg:w-auto lg:pl-[9%]">
                      <div className="flex items-center justify-center lg:justify-start mb-2">
                        <FaRegEnvelope className="mr-2" />
                        <a href="mailto:editors@bluone.ink">editors@bluone.ink</a>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start">
                        <FaPhoneFlip className="mr-2" />
                        <a href="tel:+918929200199">+91 89292-00199</a>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

          </div>
        </main>
      )}
    </>
  );
}

export default contact;
