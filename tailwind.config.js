import { createRequire } from 'module';

var require = createRequire(import.meta.url);
var module = { exports: {} };

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#48B14C",
        secondary: "#181818",
        baseBg: "#fff",
      },
    },
  },
  plugins: [],
};
