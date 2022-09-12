/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        custom: {
          "bg-light": "#f4f4f4",
          "bg-dark": "#111111",
          "bg-off-light": "#ffffff",
          "bg-off-dark": "#1f1e1e",
          "text-light": "#000000",
          "text-dark": "#ffffff",
          "text-off-light": "#f9f9f9",
          "text-off-dark": "#000000",
        },
      },
    },
  },
  plugins: [],
};
