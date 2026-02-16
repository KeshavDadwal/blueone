"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Loader from "@/app/components/Loader";

const ComingSoon = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid place-content-center place-items-center pb-30 h-screen top_bg_gradient">
          <h3 className="font-medium pb-10 p-5 pt-0">In the works.</h3>
          <p className="text-center">
            When you wait with us, you become a part of our journey.
            <br />
            And together, we can create something winsome.
          </p>
          <div className="flex gap-5 pt-20 p-5 pb-0">
            <p className="font-barlow text-[#007DD7] uppercase">
              <Link href="/" className="hover:underline underline-offset-4">
                Let’s take you <span className="font-semibold">Home</span>
              </Link>
            </p>
            <p className="font-barlow text-[#007DD7] uppercase">
              <Link href="/books" className="hover:underline underline-offset-4">
                Or to our <span className="font-semibold">Library</span>
              </Link>
            </p>
            <p className="font-barlow text-[#007DD7] uppercase">
              <Link href="/authors" className="hover:underline underline-offset-4">
                Or to our <span className="font-semibold">Authors’ Lounge</span>
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ComingSoon;
