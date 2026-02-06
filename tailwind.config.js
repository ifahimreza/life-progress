/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./libs/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Manrope", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "none"
      }
    }
  },
  plugins: []
};
