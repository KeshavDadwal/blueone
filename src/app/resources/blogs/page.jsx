"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiXCircle } from "react-icons/fi";
import Loader from "@/app/components/Loader";
import BlogsCards from "./BlogsCards";
import Link from "next/link";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet";
import { processBlogData } from "@/app/API/blogUtils";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  // Sorting state
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"

  // Fetch blog data from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("https://dashboard.bluone.ink/api/public/blogs");
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        // Process each blog's data
        const processedBlogs = data.map(blog => processBlogData(blog));
        setBlogs(processedBlogs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Calculate the index range for the current page's blogs
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;

  // Sort blogs by id
  const sortedBlogs = [...blogs].sort((a, b) => {
    return sortOrder === "newest" ? b.id - a.id : a.id - b.id;
  });

  // Filter blogs based on search query
  const filteredBlogs = sortedBlogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get blogs for the current page
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Total number of pages
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main className="flex flex-col h-full pb-20 mx-auto top_bg_gradient">
          <HelmetProvider>
            <Helmet>
              <title>All Blogs | BluOne Ink Publishing</title>
              <meta name="description" content="A digital log of significant news from our Operations and thoughts from the Desks of our Editorial Team and Authors." />
              <link rel="canonical" href="https://www.bluone.ink/resources/blogs" />
            </Helmet>
          </HelmetProvider>
          <div className="container px-4 mx-auto">
            <div className="w-full flex justify-center">
              <h1 className="text-[42px] font-medium pt-20 pb-14">All Blogs</h1>
            </div>

            {/* Search Bar and Sort Filter */}
            <div className="w-full flex justify-between items-center pt-6 pb-2">
              <div className="w-full flex flex-wrap lg:flex-nowrap space-x-4 gap-6 items-center">
                {/* Newest / Oldest Filter */}
                <div className="flex justify-start items-center pb-4">
                  <p className="text-[#0D1928] font-semibold mr-2">View:</p>
                  <button
                    className={`mr-2 text-lg font-medium ${
                      sortOrder === "newest" ? "text-[#0D1928]" : "text-[#8A8A8A]"
                    }`}
                    onClick={() => setSortOrder("newest")}
                  >
                    Newest
                  </button>
                  <span className="text-[#8A8A8A]">/</span>
                  <button
                    className={`ml-2 text-lg font-medium ${
                      sortOrder === "oldest" ? "text-[#0D1928]" : "text-[#8A8A8A]"
                    }`}
                    onClick={() => setSortOrder("oldest")}
                  >
                    Oldest
                  </button>
                </div>
                {/* Search Input */}
                <div className="relative w-full">
                  <FiSearch className="absolute left-4 top-3 w-6 h-6 text-[#8A8A8A]" />
                  {searchQuery && (
                    <FiXCircle
                      className="absolute right-4 top-3.5 w-6 h-6 text-[#8A8A8A] cursor-pointer"
                      onClick={() => setSearchQuery("")}
                    />
                  )}
                  <input
                    type="text"
                    placeholder="Which blog interests you today?"
                    className="p-3 bg-transparent input-border shadow-sm rounded-3xl w-full mb-4 text-black pl-12 placeholder:italic"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Blogs Grid */}
            <div className={`pt-6 ${currentBlogs.length > 0 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex justify-center items-center h-64"}`}>
              {currentBlogs.length > 0 ? (
                currentBlogs.map((blog) => (
                  <Link
                    href={`/resources/blogs/${encodeURIComponent(blog.blogslug)}`}
                    key={blog.id}
                    className="p-4 mb-4 hover:shadow-md input-border border-[#ffffff00] hover:border-[#BABABA] rounded-md"
                  >
                    <BlogsCards
                      title={blog.title}
                      blogimage={blog.blogimage}
                      imageContainerClass="h-[200px] lg:h-[300px]"
                    />
                  </Link>
                ))
              ) : (
                <p className="text-md">No results found</p>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="w-full flex-wrap md:flex justify-center md:justify-between mt-10">
              {currentBlogs.length > 0 && (
                <div className="flex justify-center pb-5 md:justify-between">
                  <i>
                    <p>
                      Showing {indexOfFirstBlog + 1}- {Math.min(indexOfLastBlog, filteredBlogs.length)} of{" "}
                      {filteredBlogs.length} Blogs
                    </p>
                  </i>
                </div>
              )}

              {totalPages > 1 && (
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
                      className={`p-1 px-2.5 py-0 text-lg font-medium font-barlow text-[#8A8A8A] rounded-full  ${
                        currentPage === i + 1
                          ? "bg-[#8A8A8A66] text-black"
                          : "bg-white hover:bg-[#241b6d] hover:text-white"
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
                      <MdOutlineArrowRight className="text-[#241b6d] w-6 h-6" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </>
  );
}
