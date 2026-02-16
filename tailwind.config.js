/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      gridTemplateColumns: {
        // Add a custom 15-column grid
        '15': 'repeat(15, minmax(0, 1fr))',
      },
      lineHeight: {
        'extra-loose': '3rem !important',
        'medium-loose': '2.5rem !important',
      },
      border: {
          'border-l-1': '1px solid #D9D9D9',
      }
    },
  },
  plugins: [],
};
