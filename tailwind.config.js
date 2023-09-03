/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "roman-coffee": {
          50: "#f5f4f1",
          100: "#e6e3db",
          200: "#cfc9b9",
          300: "#b4a790",
          400: "#9e8c71",
          500: "#8f7b63",
          600: "#776351",
          700: "#635145",
          800: "#55453e",
          900: "#4b3d38",
          950: "#2a211e",
        },
      },
    },
  },
  plugins: [],
}

