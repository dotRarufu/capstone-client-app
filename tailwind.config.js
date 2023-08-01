/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    screens: {
      sm1: "600px",
      sm2: "905px",
      md: "1240px",
      lg: "1440px",
    },
  },
  daisyui: {
    
    themes: [
      {
        original: {
          primary: "#3127b4",
          secondary: "#0b874b",
          accent: "#d64546",
          neutral: "#4b5563",
          "base-100": "#f3f4f6",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
      "dark", "cupcake", 
    ],
  },
  plugins: [require("daisyui")],
};
