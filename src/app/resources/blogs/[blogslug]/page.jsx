"use client";
import { useState, useEffect } from "react";
import { allBlogsList } from "@/app/API/allBlogsList"; // keeping for related blogs
import Loader from "@/app/components/Loader";
import inkdouble1 from "@/app/assests/image/inkdouble1.svg";
import inkdouble2 from "@/app/assests/image/inkdouble2.svg";
import BlogsCards from "../BlogsCards";
import Link from "next/link";
import Image from "next/image";
import { Helmet } from "react-helmet";
import { processBlogData } from "@/app/API/blogUtils";
import { getAllBlogs } from "@/app/API/allBlogsList";

const Page = ({ params }) => {
  const blogslug = decodeURIComponent(params.blogslug);

  const defaultimage =
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`https://dashboard.bluone.ink/api/public/blogs/${blogslug}`);
        if (!response.ok) {
          throw new Error("Blog not found");
        }
        const data = await response.json();
        console.log("Current blog data:", data); // Debug log
        setBlog(processBlogData(data));
      } catch (error) {
        console.error(error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogslug]);

  useEffect(() => {
    const handleScroll = () => {
      const blogContent = document.getElementById("blog-content");

      if (blogContent) {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const blogHeight = blogContent.offsetHeight;
        const totalScrollableHeight = blogHeight - windowHeight;

        if (totalScrollableHeight > 0) {
          const scrolled = Math.min(scrollTop / totalScrollableHeight, 1);
          setScrollPercentage(Math.round(scrolled * 100));
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [blogslug]);

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      if (blog?.categories) {
        console.log("Current blog categories:", blog.categories);
        const allBlogs = await getAllBlogs();
        console.log("All blogs:", allBlogs);
        const filtered = allBlogs.filter(
          (relatedBlog) => {
            console.log("Comparing:", {
              relatedBlogSlug: relatedBlog.slug,
              currentSlug: blogslug,
              relatedBlogCategory: relatedBlog.categories,
              currentCategory: blog.categories
            });
            return relatedBlog.slug !== blogslug && 
                   relatedBlog.categories === blog.categories;
          }
        );
        console.log("Filtered related blogs:", filtered);
        setRelatedBlogs(filtered);
      }
    };

    fetchRelatedBlogs();
  }, [blog, blogslug]);

  if (!blog && !loading) {
    return <div>Blog not found.</div>;
  }

  // Function to format the date to "Month day, year"
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Meta title and description
  const pageTitle = `${blog?.title} | BluOne Ink Publishing`;
  const pageDescription = blog?.meta_description;
  const canonicalUrl = `https://www.bluone.ink/resources/blogs/${blogslug}`;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main id="blog-content" className="wrapper pt-0 mt-0 lg:pb-20 relative top-0">
          <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <link rel="canonical" href={canonicalUrl} />
          </Helmet>

          {/* Scroll Progress Indicator */}
          <div className="lg:w-[10%] w-[50px] fixed top-80 left-0 right-0 lg:flex justify-between items-center h-12 px-0 lg:px-4 z-[1111]">
            <div className="p-2 text-lg font-light bg-[#ffffff] font-barlow shadow-md rounded-md">
              {scrollPercentage}%
            </div>
          </div>

          {/* Page Container */}
          <div className="w-full bottom-0">
            <img
              src={blog?.blogbanner || defaultimage}
              className="w-full h-[500px] object-cover blogbannerpath"
            />
          </div>

          <section>
            <div className="container relative z-[111]">
              <div className="blog-wrapper p-10 pt-6 lg:w-[70%] -mt-96 mx-auto bg-white rounded-3xl shadow-md">
                <Link href="/resources/blogs">
                  <i>
                    <h6 className="text-[16px] text-center text-[#007DD7]">
                      Back to All Blogs
                    </h6>
                  </i>
                </Link>
                <h3 className="text-center mb-6 pt-6">{blog?.title || "Blog"}</h3>

                {/* Display Blog Content */}
                <div className="blog-content prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: blog?.content }} />
                </div>

                {/* Category Showing */}
                <div className="w-full pt-6">
                  <i>
                    <h6 className="text-[16px] font-normal font-ibm">
                      Categories:{" "}
                      <span className="text-[16px] text-[#007DD7] font-normal font-ibm underline">
                        {blog?.categories || "No categories"}
                      </span>
                    </h6>
                  </i>
                </div>

                {/* Author Showing */}
                <div className="pt-1 pb-6">
                  <i>
                    <ul className="lg:w-[40%] flex gap-6 lg:gap-0">
                      <li className="lg:w-[33%] font-ibm">{blog?.author || "No author"}</li>
                      <li className="lg:list-disc font-ibm">
                        {blog?.publishedDate ? formatDate(blog.publishedDate) : "No date"}
                      </li>
                    </ul>
                  </i>
                </div>
              </div>
            </div>
          </section>

          {/* Related Blogs Section */}
          <section id="related-titles" className="container">
            <div className="flex items-center gap-2 justify-center pb-2 pt-20">
              <Image src={inkdouble1} width={55} height={55} alt="inkdouble1" />
              <i>
                <h3 className="font-medium text-2xl md:text-2xl text-center">
                  Related Blogs
                </h3>
              </i>
              <Image src={inkdouble2} width={55} height={55} alt="inkdouble2" />
            </div>
            <div className="flex items-center justify-center pb-6">
              <Link href="/resources/blogs">
                <i>
                  <h4 className="text-[#007DD7] text-base underline font-medium">
                    View All Blogs
                  </h4>
                </i>
              </Link>
            </div>

            <div
              className={`${
                relatedBlogs.length > 2
                  ? `grid grid-cols-2 lg:grid-cols-3 ${
                      relatedBlogs.length < 6 ? "justify-between" : "justify-center"
                    }`
                  : "flex justify-center"
              }`}
            >
              {relatedBlogs.length > 0 ? (
                relatedBlogs
                  .slice(0, 3)
                  .map((relatedBlog, i) => (
                    <div
                      key={i}
                      className="p-4 mb-4 hover:shadow-md input-border border-[#ffffff00] hover:border-[#BABABA] rounded-md"
                    >
                      <Link
                        href={`/resources/blogs/${relatedBlog.slug}`}
                        style={{ textDecoration: "none" }}
                      >
                        <BlogsCards
                          key={relatedBlog.id}
                          title={relatedBlog.title}
                          blogimage={relatedBlog.blogImage || defaultimage}
                          imageContainerClass="h-[200px] lg:h-[300px]"
                        />
                      </Link>
                    </div>
                  ))
              ) : (
                <div className="flex justify-center items-center w-full h-[100px]">
                  No related blogs found.
                </div>
              )}
            </div>
          </section>
        </main>
      )}
    </>
  );
};

export default Page;
