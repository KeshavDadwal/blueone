"use client";

import { useEffect, useState } from "react";

const mediaList = [
  {
    type: "youtube",
    id: "n96v0EJRl4c",
    thumb: "https://img.youtube.com/vi/n96v0EJRl4c/hqdefault.jpg",
  },
  {
    type: "youtube",
    id: "VIDEO_ID_2",
    thumb: "https://img.youtube.com/vi/VIDEO_ID_2/hqdefault.jpg",
  },
  {
    type: "instagram",
    url: "https://www.instagram.com/reel/REEL_ID/",
    thumb: "/insta-thumb-1.jpg",
  },
];

export default function SpotlightSection() {
  const [active, setActive] = useState(mediaList[0]);

  useEffect(() => {
    if (active.type === "instagram") {
      if (!window.instgrm) {
        const script = document.createElement("script");
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
      } else {
        window.instgrm.Embeds.process();
      }
    }
  }, [active]);

  return (
    /* FULL WIDTH WHITE SECTION */
    <section className="w-full bg-white py-16">
      {/* INNER CONTAINER */}
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADING WITH DIVIDER */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-black whitespace-nowrap">
            Spotlight
          </h2>
          <span className="h-[1px] w-full bg-gray-300"></span>
        </div>

        {/* MAIN PLAYER */}
        <div className="w-full bg-black rounded-2xl overflow-hidden aspect-video mb-6">
          {active.type === "youtube" && (
            <iframe
              src={`https://www.youtube.com/embed/${active.id}?rel=0`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {active.type === "instagram" && (
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={active.url}
              data-instgrm-version="14"
              style={{ width: "100%" }}
            />
          )}
        </div>

        {/* THUMBNAIL SLIDER */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {mediaList.map((item, index) => (
            <div
              key={index}
              onClick={() => setActive(item)}
              className={`min-w-[220px] cursor-pointer rounded-xl overflow-hidden border transition
                ${
                  active === item
                    ? "border-black"
                    : "border-gray-300 opacity-70 hover:opacity-100"
                }`}
            >
              <img
                src={item.thumb}
                alt="spotlight thumbnail"
                className="w-full h-[130px] object-cover"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
