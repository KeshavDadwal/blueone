import React from 'react'
import { Inter } from "next/font/google";
import "../assests/css/custom.css";
const inter = Inter({ subsets: ["latin"] });


function Header() {
    return (
        <div>
        <link rel="icon" href="../assests/image/Logo.png" sizes="any" />
        {/* <style>@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');</style> */}
        </div>
    )
}

export default Header
