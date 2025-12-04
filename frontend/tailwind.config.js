import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        border: "borderRotate 4s linear infinite",
      },
      keyframes: {
        borderRotate: {
          to: { "--border-angle": "360deg" },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        "@property --border-angle": {
          syntax: "<angle>",
          inherits: false,
          "initial-value": "0deg",
        },
      });
    }),
  ],
};
