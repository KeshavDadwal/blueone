"use client"
import React, {useState, useEffect } from 'react'
import Link from 'next/link'
import Loader from "@/app/components/Loader";
import { HelmetProvider } from 'react-helmet-async';
import { Helmet } from 'react-helmet';

function policies() {

    const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

    return (
        <>
    {loading ? (
    <Loader /> 
  ) : (
        <main>
          <HelmetProvider>
            <Helmet>
              <title>Policies, Terms, and Disclaimer | BluOne Ink Publishing</title>
              <meta name="description" content="Certainly the only part of our operation which has the least literary flair." />
              <link rel="canonical" href="https://www.bluone.ink/resources/policies" />
            </Helmet>
          </HelmetProvider> 
    <div className="grid place-content-center place-items-center pb-30 h-screen top_bg_gradient">
          <h3 className="font-medium pb-10 p-5 pt-0 link"><Link href="/resources/policies/privacy">Privacy</Link></h3>
          <h3 className="font-medium pb-10 p-5 pt-0 link"><Link href="/resources/policies/terms">Terms & Conditions</Link></h3>
          <h3 className="font-medium pb-10 p-5 pt-0 link"><Link href="/resources/policies/disclaimer">Disclaimer</Link></h3>
        </div>
        </main>
        )}
        </>
    )
}

export default policies
