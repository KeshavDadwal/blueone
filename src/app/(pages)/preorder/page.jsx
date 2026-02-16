"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet";
function preorder() {

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://tally.so/widgets/embed.js';
        script.async = true;
        script.onload = () => {
            if (typeof Tally !== 'undefined') {
                Tally.loadEmbeds();
            }
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

  return (
    <div className="w-full grid place-content-center place-items-center pb-30 h-screen top_bg_gradient">
      <HelmetProvider>
        <Helmet>
          <title></title>
          <meta
            name="description"
            content=""
          />
        </Helmet>
      </HelmetProvider>
      <div className="grid self-center items-center p-5 w-[450px]">
        <div className='w-full flex justify-center mx-auto pb-[50px]'>
                        <iframe
                            data-tally-src="https://tally.so/embed/w5LPgQ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                            loading="lazy"
                            width="100%"
                            height="200"
                            frameBorder="0"
                            marginHeight="0"
                            marginWidth="0"
                            title="Ink in your Inbox"
                        ></iframe>
                        
                    </div>
      </div>
    </div>
  );
}

export default preorder;
