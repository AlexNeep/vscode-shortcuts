/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ['"Poppins"'],
    },
    extend: {
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0.2, 0.6, 1) infinite;",
      },
      gridTemplateRows: {
        8: "repeat(8, minmax(0, 1fr))",
      },
    },
  },
  plugins: [require("tailwindcss-animation-delay")],
};
