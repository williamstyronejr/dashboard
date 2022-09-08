/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        custom: {
          "bg-off-light": "#f9f9f9",
          "bg-off-dark": "#000000",
        },
      },
    },
  },
  plugins: [],
};
