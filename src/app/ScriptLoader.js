'use client'; // Mark this component as a Client Component

import React, { useEffect } from 'react';

const ScriptLoader = () => {
    useEffect(() => {
        // Array of script URLs
        const scripts = [
            "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js"
        ];

        // Function to load each script
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject();
                document.body.appendChild(script);
            });
        };

        // Load all scripts
        Promise.all(scripts.map(loadScript))
            .then(() => {
                console.log('All scripts loaded successfully');
                // Initialize your carousel or any other functionality here
            })
            .catch((error) => {
                console.error('Error loading scripts:', error);
            });

        // Cleanup function to remove scripts if needed
        return () => {
            scripts.forEach(src => {
                const script = document.querySelector(`script[src="${src}"]`);
                if (script) {
                    document.body.removeChild(script);
                }
            });
        };
    }, []);

    return null; // Or any JSX you want to render
};

export default ScriptLoader;