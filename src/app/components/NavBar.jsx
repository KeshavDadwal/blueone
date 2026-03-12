'use client';
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import navbarLogo from "../assests/image/navbarLogo.png";
import { IoCloseSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaChevronDown } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

function NavBar({ categoryCounts = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const totalBooks = categoryCounts || {};
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);
  const isActive = (path) => {
  if (path === "/") return pathname === "/" ? "text-[#FFDE7C]" : "text-white";
  return pathname.startsWith(path) ? "text-[#FFDE7C]" : "text-white";
};

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchBar(false);
      }
    }
    if (showSearchBar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchBar]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
  
    const controller = new AbortController();
    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://dashboard.bluone.ink/api/v1/public/books-list/search?search=${encodeURIComponent(query)}&limit=6`,
          { signal: controller.signal }
        );
  
        if (!res.ok) throw new Error("Search failed");
  
        const data = await res.json();
        setResults(data.books || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 400);
  
    return () => {
      controller.abort();
      clearTimeout(delayDebounce);
    };
  }, [query]);
  const handleBookClick = (slug) => {
    setQuery("");
    setResults([]);
    setShowSearchBar(false);
    router.push(`/books/${slug}`);
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navmain w-full fixed h-[60px] z-[11111] bg-[#241b6d] px-4 bg-no-repeat">
        {/* Mobile + Tablet Header */}
        <div className="md:grid md:grid-cols-12 md:items-center">
          <div className="col-span-2"></div>

          <div className="md:col-span-12 lg:col-span-8 lg:m-auto">
            <div className="flex items-center justify-between w-full lg:hidden h-[60px]">
              <Link href="/" className="flex items-center h-10">
                <Image
                  src={navbarLogo}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </Link>

              <div className="flex items-center gap-2 ml-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by Title, Author or ISBN"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && query.trim()) {
                        router.push(`/search?query=${encodeURIComponent(query)}`);
                        setQuery("");
                        setResults([]);
                      }
                    }}
                    className="w-full h-10 px-3 rounded-full text-black text-sm focus:outline-none"
                  />

                  {/* Search icon */}
                  <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" />

                  {/* Mobile search results dropdown */}
                  {query && results.length > 0 && (
                    <ul className="absolute top-full left-0 w-full bg-white border rounded-md shadow-md mt-2 max-h-[300px] overflow-y-auto z-[99999]">
                      {results.map((book) => (
                        <li
                          key={book.id}
                          onClick={() => handleBookClick(book.slug)}
                          className="p-2 cursor-pointer hover:bg-gray-100 text-black"
                        >
                          <p className="text-sm font-medium line-clamp-2">
                            {book.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {book.author?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {book.isbn13}
                          </p>
                        </li>
                      ))}
                      <li
                        className="p-2 text-center cursor-pointer hover:underline border-t text-black"
                        onClick={() => {
                          router.push(`/search?query=${encodeURIComponent(query)}`);
                          setQuery("");
                          setResults([]);
                        }}
                      >
                        See all results
                      </li>
                    </ul>
                  )}

                  {query && loading && (
                    <div className="absolute top-full left-0 w-full bg-white p-2 text-sm text-gray-500 mt-2">
                      Searching...
                    </div>
                  )}
                </div>

                {/* Hamburger */}
                <button onClick={toggleMenu} className="text-white text-2xl">
                  {isOpen ? <IoCloseSharp /> : <RxHamburgerMenu />}
                </button>
              </div>
            </div>
            {/* Desktop Menu */}
            <ul className="hidden mx-auto text-center lg:flex space-x-20 navbar items-center">
      
            {/* Home */}
            <li className={`hover:text-[#FFDE7C] ${isActive('/')}`}>
              <Link href="/" className="ifont">
                  Home
              </Link>
            </li>

            {/* About */}
            <li className={`hover:text-[#FFDE7C] ${isActive('/about-us')} `}>
              <Link href="/about-us" className="ifont">
                  About
              </Link>
            </li>
            
            {/* Books */}
              <li
                className={`relative group hover:text-[#FFDE7C] flex items-center h-[60px] ${isActive('/books')}`}
                onMouseEnter={() => setShowSubMenu(true)}
                onMouseLeave={() => setShowSubMenu(false)}
              >
                <div className="flex items-center cursor-pointer">
                  <Link href="/category" className="ifont">
                    Books
                  </Link>
                  

                  <FaChevronDown
                    className={`ml-1 mt-2 transition-transform duration-300 ${
                      showSubMenu ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {showSubMenu && (
                <ul
                  className="absolute top-full left-0 w-64 bg-[#241b6d] text-white shadow-lg z-[999] rounded-b-md"
                  onMouseEnter={() => setShowSubMenu(true)}
                  onMouseLeave={() => setShowSubMenu(false)}
                >
                  {/* Best Seller */}
                  <li className="text-sm hover:bg-[#372f87] hover:text-[#FFDE7C] px-4 py-2 text-left font-ibm cursor-pointer whitespace-nowrap">
                    <Link href="/books?category=bestsellers" className="flex justify-between">
                      <span>Best Seller</span>
                      {totalBooks['Bestsellers'] > 0 && (
                        <span className="text-[#FFDE7C]">({totalBooks['Bestsellers']})</span>
                      )}
                    </Link>
                  </li>

                  {/* New Releases */}
                  <li className="text-sm hover:bg-[#372f87] hover:text-[#FFDE7C] px-4 py-2 text-left font-ibm cursor-pointer whitespace-nowrap">
                    <Link href="/books?category=new-releases" className="flex justify-between">
                      <span>New Releases</span>
                      {totalBooks['New-Releases'] > 0 && (
                        <span className="text-[#FFDE7C]">({totalBooks['New-Releases']})</span>
                      )}
                    </Link>
                  </li>

                  {/* Coming Soon */}
                  <li className="text-sm hover:bg-[#372f87] hover:text-[#FFDE7C] px-4 py-2 text-left font-ibm cursor-pointer whitespace-nowrap">
                    <Link href="/books?category=coming-soon" className="flex justify-between">
                      <span>Coming Soon</span>
                      {totalBooks['Coming-Soon'] > 0 && (
                        <span className="text-[#FFDE7C]">({totalBooks['Coming-Soon']})</span>
                      )}
                    </Link>
                  </li>

                  {/* Divider */}
                  <li className="border-t border-[#3f3690] my-1"></li>

                  {/* Categories */}
                  <li className="text-sm hover:bg-[#372f87] hover:text-[#FFDE7C] px-4 py-2 text-left font-ibm cursor-pointer whitespace-nowrap">
                    <Link href="/books?category=Non-Fiction" className="flex justify-between">
                      <span>Non-Fiction</span>
                      {totalBooks['Non-Fiction'] > 0 && (
                        <span className="text-[#FFDE7C]">({totalBooks['Non-Fiction']})</span>
                      )}
                    </Link>
                  </li>
                  <li className="text-sm hover:bg-[#372f87] hover:text-[#FFDE7C] px-4 py-2 text-left font-ibm cursor-pointer whitespace-nowrap">
                    <Link href="/books?category=Fiction" className="flex justify-between">
                      <span>Fiction</span>
                      {totalBooks['Fiction'] > 0 && (
                        <span className="text-[#FFDE7C]">({totalBooks['Fiction']})</span>
                      )}
                    </Link>
                  </li>
                  <li className="text-sm hover:bg-[#372f87] hover:text-[#FFDE7C] px-4 py-2 text-left font-ibm cursor-pointer whitespace-nowrap">
                    <Link href="/books?category=Children" className="flex justify-between">
                      <span>Children</span>
                      {totalBooks['Children'] > 0 && (
                        <span className="text-[#FFDE7C]">({totalBooks['Children']})</span>
                      )}
                    </Link>
                  </li>
                  <li className="border-t border-[#3f3690] my-1"></li>

                  {/* ✅ Catalogue download option */}
                  <li className="text-sm hover:bg-[#372f87] hover:text-[#FFDE7C] px-4 py-2 text-left font-ibm whitespace-nowrap">
                    <a
                      href="/catalogs/ink_catalog_cover_2026.pdf"
                      download
                      className="block w-full"
                    >
                      Catalogue (PDF)
                    </a>
                    
                  </li>
                </ul>
              )}

              </li>
              {/* Logo */}
              <li>
              <Link href="/">
                <Image src={navbarLogo} alt="Logo" height={40} className="hidden lg:block"/>
              </Link>
              </li>

              {/* Authors */}
              <li className={`hover:text-[#FFDE7C] ${isActive('/authors')}`}>
                <Link href="/authors" className="ifont">
                  Authors
                </Link>
              </li>

              {/* Submissions */}
              <li className={`hover:text-[#FFDE7C] ${isActive('/submissions')}`}>
                <Link href="/submissions" className="ifont">
                  Submissions
                </Link>
              </li>

              {/* Contact */}
              <li className={`hover:text-[#FFDE7C] ${isActive('/contact')}`}>
                <Link href="/contact" className="ifont">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="hidden lg:flex items-center">
              <div className="relative w-[220px]">
                <input
                  type="text"
                  placeholder="Search by Title, Author or ISBN "
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && query.trim()) {
                      router.push(`/search?query=${encodeURIComponent(query)}`);
                      setQuery("");
                      setResults([]);
                    }
                  }}
                  className="w-full px-3 pr-10 py-1.5 rounded-full text-black text-sm focus:outline-none border border-transparent focus:border-gray-300"
                />

                {/* SEARCH ICON */}
                <button
                  onClick={() => {
                    if (query.trim()) {
                      router.push(`/search?query=${encodeURIComponent(query)}`);
                      setQuery("");
                      setResults([]);
                    }
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                >
                  <FiSearch size={16} />
                </button>

                {/* RESULTS DROPDOWN */}
                {query && results.length > 0 && (
                  <ul className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-2 max-h-[300px] overflow-y-auto z-[99999]">
                    {results.map((book) => (
                      <li
                        key={book.id}
                        onClick={() => handleBookClick(book.slug)}
                        className="p-3 cursor-pointer hover:bg-gray-100 text-black transition-colors"
                      >
                        <p className="text-sm font-medium">{book.title}</p>
                        <p className="text-xs text-gray-500">
                          {book.author?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {book.isbn13}
                          </p>
                      </li>
                    ))}

                    <li
                      className="p-3 text-center cursor-pointer hover:underline border-t text-black"
                      onClick={() => {
                        router.push(`/search?query=${encodeURIComponent(query)}`);
                        setQuery("");
                        setResults([]);
                      }}
                    >
                      See all results
                    </li>
                  </ul>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#241b6d] text-white flex flex-col p-6 z-[11111]">
          <div className="flex justify-end">
            <button onClick={() => setIsOpen(false)} className="text-2xl mb-4">
              <IoCloseSharp />
            </button>
          </div>
          <Link href="/" className="py-2 border-b" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/about-us" className="py-2 border-b" onClick={() => setIsOpen(false)}>
            About
          </Link>
          
          <div className="py-2 border-b">
            <p className="flex items-center justify-between cursor-pointer" onClick={() => setShowSubMenu(!showSubMenu)}>
              Books <FaChevronDown className={`ml-2 transition-transform ${showSubMenu ? "rotate-180" : ""}`} />
            </p>
            {showSubMenu && (
              <ul className="mt-2">
                {/* Best Seller */}
                <li className="text-sm hover:bg-[#372f87] hover:text-[#FFDE7C] px-4 py-2 text-left font-ibm cursor-pointer whitespace-nowrap">
                  <Link href="/books?category=bestsellers" className="flex justify-between">
                    <span>Best Seller</span>
                    {totalBooks['Bestsellers'] > 0 && (
                      <span className="text-[#FFDE7C]">({totalBooks['Bestsellers']})</span>
                    )}
                  </Link>
                </li>

                {/* New Releases */}
                <li className="text-sm hover:bg-[#372f87] hover:text-[#FFDE7C] px-4 py-2 text-left font-ibm cursor-pointer whitespace-nowrap">
                  <Link href="/books?category=new-releases" className="flex justify-between">
                    <span>New Releases</span>
                    {totalBooks['New-Releases'] > 0 && (
                      <span className="text-[#FFDE7C]">({totalBooks['New-Releases']})</span>
                    )}
                  </Link>
                </li>

                {/* Coming Soon */}
                <li className="text-sm hover:bg-[#372f87] hover:text-[#FFDE7C] px-4 py-2 text-left font-ibm cursor-pointer whitespace-nowrap">
                  <Link href="/books?category=coming-soon" className="flex justify-between">
                    <span>Coming Soon</span>
                    {totalBooks['Coming-Soon'] > 0 && (
                      <span className="text-[#FFDE7C]">({totalBooks['Coming-Soon']})</span>
                    )}
                  </Link>
                </li>

                {/* Divider */}
                <li className="border-t border-[#3f3690] my-1"></li>

                {/* Categories */}
                <li className="text-sm hover:bg-[#372f87] hover:text-[#FFDE7C] px-4 py-2 text-left font-ibm cursor-pointer whitespace-nowrap">
                  <Link href="/books?category=Non-Fiction" className="flex justify-between">
                    <span>Non-Fiction</span>
                    {totalBooks['Non-Fiction'] > 0 && (
                      <span className="text-[#FFDE7C]">({totalBooks['Non-Fiction']})</span>
                    )}
                  </Link>
                </li>
                <li className="text-sm hover:bg-[#372f87] hover:text-[#FFDE7C] px-4 py-2 text-left font-ibm cursor-pointer whitespace-nowrap">
                  <Link href="/books?category=Fiction" className="flex justify-between">
                    <span>Fiction</span>
                    {totalBooks['Fiction'] > 0 && (
                      <span className="text-[#FFDE7C]">({totalBooks['Fiction']})</span>
                    )}
                  </Link>
                </li>
                <li className="text-sm hover:bg-[#372f87] hover:text-[#FFDE7C] px-4 py-2 text-left font-ibm cursor-pointer whitespace-nowrap">
                  <Link href="/books?category=Children" className="flex justify-between">
                    <span>Children</span>
                    {totalBooks['Children'] > 0 && (
                      <span className="text-[#FFDE7C]">({totalBooks['Children']})</span>
                    )}
                  </Link>
                </li>

                {/* Divider */}
                <li className="border-t border-[#3f3690] my-1"></li>

                {/* Catalogue */}
                <li className="text-sm hover:bg-[#372f87] hover:text-[#FFDE7C] px-4 py-2 text-left font-ibm whitespace-nowrap">
                  <a
                    href="/catalogs/ink_catalog_cover_2026.pdf"
                    download
                    className="block w-full"
                  >
                    Catalogue (PDF)
                  </a>
                </li>
              </ul>
              )} 
          </div>
          <Link href="/authors" className="py-2 border-b" onClick={() => setIsOpen(false)}>
            Authors
          </Link>
          <Link href="/submissions" className="py-2 border-b" onClick={() => setIsOpen(false)}>
            Submissions
          </Link>
          <Link href="/contact" className="py-2 border-b" onClick={() => setIsOpen(false)}>
            Contact Us
          </Link>
        </div>
      )}
    </div>
  );
}

export default NavBar;
