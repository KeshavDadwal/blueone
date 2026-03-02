"use client";
import { useState, useEffect } from "react";
import Loader from "@/app/components/Loader";
import GalleryCards from "./GalleryCards";
import Link from "next/link";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("newest");
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const sortedGallery = [...gallery].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.id - a.id;
    } else {
      return a.id - b.id;
    }
  });

  const filteredGallery = sortedGallery.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentGallery = filteredGallery.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredGallery.length / itemsPerPage);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const response = await fetch("https://dashboard.bluone.ink/api/public/gallery");
        const data = await response.json();
        setGallery(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main className="flex flex-col h-full pb-20 mx-auto top_bg_gradient">
          <HelmetProvider>
            <Helmet>
              <title>Gallery | BluOne Ink Publishing</title>
              <meta
                name="description"
                content="Browse our gallery to explore highlights and events from our Editorial Team and Authors."
              />
              <link
                rel="canonical"
                href="https://www.bluone.ink/resources/gallery"
              />
            </Helmet>
          </HelmetProvider>
          <div className="container px-4 mx-auto">
            <div className="w-full flex justify-center">
              <h1 className="text-[42px] font-medium pt-20 pb-10">Gallery</h1>
            </div>

            <section id="gallery" className="container">
              <div
                className={`pt-6 ${
                  currentGallery.length > 0
                    ? "grid grid-cols-2 lg:grid-cols-3 gap-4"
                    : "flex justify-center items-center h-64"
                }`}
              >
                {currentGallery.length > 0 ? (
                  currentGallery.map((item) => (
                    <Link
                      href={`/resources/gallery/${item.slug}`} // Update the slug link
                      key={item.id}
                      className="p-4 mb-4 hover:shadow-md input-border border-[#ffffff00] hover:border-[#BABABA] rounded-md"
                    >
                      <GalleryCards
                        title={item.title}
                        gallerydate={item.date}
                        galleryimage={item.imageUrl} // Use the imageUrl from the API response
                        imageContainerClass="h-[200px] lg:h-[280px]"
                      />
                    </Link>
                  ))
                ) : (
                  <p className="text-md">No results found</p>
                )}
              </div>

              <div className="w-full flex-wrap md:flex justify-center md:justify-between mt-10">
                {currentGallery.length > 0 && (
                  <div className="flex justify-center pb-5 md:justify-between">
                    <i><p>
                      Showing {indexOfFirstItem + 1}-
                      {Math.min(indexOfLastItem, filteredGallery.length)} of{" "}
                      {filteredGallery.length}
                    </p></i>
                  </div>
                )}

                {totalPages > 1 && filteredGallery.length > itemsPerPage && (
                  <div className="flex justify-center gap-2 items-center">
                    {currentPage > 1 && (
                      <button
                        onClick={() => {
                          setCurrentPage((prev) => prev - 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="p-2 mx-2 flex items-center text-[#241b6d] hover:rounded-md hover:text-[#241b6d]"
                      >
                        <MdOutlineArrowLeft className="w-6 h-6" />
                      </button>
                    )}

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`p-1 px-2.5 py-0 text-lg font-medium text-[#8A8A8A] font-barlow rounded-full w-[30px] h-[30px] ${
                          currentPage === i + 1
                            ? "bg-[#8A8A8A66] text-black"
                            : "bg-white hover:bg-[#241b6d] hover:text-white font-normal"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    {currentPage < totalPages && (
                      <button
                        onClick={() => {
                          setCurrentPage((prev) => prev + 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="p-2 mx-2 flex items-center text-[#241b6d] hover:rounded-md hover:text-[#241b6d]"
                      >
                        <MdOutlineArrowRight className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      )}
    </>
  );
}
