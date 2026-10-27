/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        page: "#0c0c0e",   // page + panel background
        cream: "#f3efe6",  // main text
        dim: "#a5a5ab",    // secondary text
        line: "#2a2a2f",   // panel borders and dividers
        accent: "#4254e8", // blue
        glow: "#7886ff",   // lighter blue for small text
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};