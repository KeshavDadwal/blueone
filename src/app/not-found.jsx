"use client"
import React from 'react'
import Link from 'next/link'
import { HelmetProvider } from 'react-helmet-async'
import { Helmet } from 'react-helmet'
function notfound() {
    return (
        <div className='w-full grid place-content-center place-items-center pb-30 h-screen top_bg_gradient'>
             <HelmetProvider>
  <Helmet>
    <title>Page Not Found | BluOne Ink Publishing</title>
    <meta name="description" content="Someone tore this page off the book. Or it was never there. Or you know something we don't. All we can say is that we can't say anything about this page." />
  </Helmet>
</HelmetProvider>
            <div className="grid place-content-center place-items-center p-5 sm:pt-[40px] sm:pb-[230px] ">
                <div className=' sm:pt-[250px] '>
                    <h2 className='font-medium pb-10 text-lg sm:text-4xl'>What you seek is seeking you…</h2>
                    <h2 className='font-medium ml-24 pb-[60px] sm:pb-[100px] text-lg sm:text-4xl'>… but you’re off by a small margin.</h2>
                </div>
                <Link href="/">
                    <button className='btn-primary mb-[20px]'>
                        Take a Step Back
                    </button>
                </Link>
                <p className=' hover:u text-[#007DD7] font-medium'><a href="#bottom"><em>(or use the links in the Footer) </em></a></p>
            </div>
        </div>


    )
}

export default notfound
