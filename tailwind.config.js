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
          "bg-btn-hover": "#5f6368",
          "text-light": "#000000",
          "text-dark": "#ffffff",
          "text-off-light": "#f9f9f9",
          "text-off-dark": "#c7c7c7",
        },
      },
      boxShadow: {
        round:
          "box-shadow: 0 0 15px rgb(0 0 0 / 15%), 0 0 1px 1px rgb(0 0 0 / 10%)",
      },
    },
  },
  plugins: [],
};
