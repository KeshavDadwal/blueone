"use client";
import { useEffect, useState } from "react";
// import localFont from "next/font/local";
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Script from "next/script";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { getAllEvents } from "@/app/API/allEventList";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export default function RootLayout({ children }) {
  // const [showPopup, setShowPopup] = useState(false);
  // const [isExpanded, setIsExpanded] = useState(false);
  // const [eventData, setEventData] = useState(null);
  // const [events, setEvents] = useState([]);

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const events = await getAllEvents();
  //       if (events && events.length > 0) {
  //         const sortedEvents = [...events].sort(
  //           (a, b) => new Date(b.eventdate) - new Date(a.eventdate)
  //         );
  //         setEvents(sortedEvents);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching events:", error);
  //     }
  //   };

  //   fetchEvents();

  //   // Time in milliseconds (2 minutes = 120000ms)
  //   const popupReappearTime = 2 * 60 * 1000;

  //   const closedTimestamp = localStorage.getItem("popupClosedTime");
  //   const now = new Date().getTime();

  //   if (!closedTimestamp || now - closedTimestamp > popupReappearTime) {
  //     // Show popup after 3 seconds delay
  //     const timer = setTimeout(() => setShowPopup(true), 3000);

  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  // const handleClosePopup = () => {
  //   setShowPopup(false);
  //   localStorage.setItem("popupClosedTime", new Date().getTime()); // Save current time
  // };

  // const handleExpandPopup = () => {
  //   setIsExpanded(true);
  // };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@100;200;300;400;500;600;700;800;900&family=IBM+Plex+Serif:wght@100;200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        <NavBar />
        <div className="theme-wrapper mt-[60px]">{children}</div>
        <Footer />

        {/* Popup Card */}
        {/* {showPopup && eventData && (
          <div
            onClick={handleExpandPopup}
            className={`fixed bottom-5 right-5 bg-white shadow-md rounded-2xl max-w-xs z-[11111] border-2 border-[#FF8100] cursor-pointer transition-all duration-500 ease-in-out ${
              isExpanded
                ? "scale-100 p-6 h-auto w-80"
                : "scale-80 p-4 h-14 w-80"
            }`}
          > */}
            {/* Initial Compact View */}
            {/* {!isExpanded && (
              <div className="flex justify-between items-center h-full w-full">
                <h3 className="text-[18px] font-semibold font-barlow w-full leading-tight">
                  UPCOMING EVENT
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClosePopup();
                  }}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none ml-2"
                >
                  ✕
                </button>
              </div>
            )} */}

            {/* Expanded Content */}
            {/* {isExpanded && (
              <>
                <div className="flex justify-end absolute top-[9px] right-[17px] text-[13px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent click
                      handleClosePopup();
                    }}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    ✕
                  </button>
                </div>
                <img
                  src={eventData.eventbanner}
                  alt={eventData.title}
                  className="w-full h-40 object-cover mt-2"
                />
                <h2 className="text-[16px] font-semibold leading-5 mt-4 mb-2 font-barlow uppercase">
                  Book Launch
                </h2>
                <h3 className="text-lg font-semibold leading-6 mt-2 font-barlow break-words uppercase">
                  {eventData.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 font-barlow">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(eventData.eventdate))}
                  {eventData.eventtiming && `, ${eventData.eventtiming}`}
                </p>
                <p className="text-sm text-gray-600 font-barlow">
                  {eventData.eventlocation}{","} {eventData.eventstate}
                </p>
                <div className="w-full flex space-x-3 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleClosePopup();
                      window.location.href = `/resources/events/${eventData.eventslug}`;
                    }}
                    className="bg-[#FF8100] text-white py-2 px-4 rounded-full text-center text-sm hover:bg-[#FF8100] font-barlow"
                  >
                    More Info
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent click event
                      handleClosePopup(); // Close the popup
                      window.location.href = `/resources/events/`;
                    }}
                    className="bg-[#FF8100] text-white py-2 px-4 rounded-full text-center text-sm hover:bg-[#FF8100] font-barlow"
                  >
                    Other Events
                  </button>
                </div>
              </>
            )}
          </div>
        )} */}

        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3CRLWYJ0QB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3CRLWYJ0QB');
          `}
        </Script>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
