/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-blue": "#092EC3",
        "sec-gray": "#F8F8F8",
        "airbnb-red": "#FF385C",
      },
    },
  },
  plugins: [],
};
