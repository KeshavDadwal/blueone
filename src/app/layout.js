import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Script from "next/script";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchCategoryCounts } from "./API/categoryCountsApi";

export default async function RootLayout({ children }) {
  const categoryCounts = await fetchCategoryCounts();
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
        <NavBar categoryCounts={categoryCounts} />
        <div className="theme-wrapper mt-[60px]">{children}</div>
        <Footer />
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
