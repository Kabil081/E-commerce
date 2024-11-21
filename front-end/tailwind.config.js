module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        bubble: "bubble 6s infinite ease-in-out",
      },
      keyframes: {
        bubble: {
          "0%, 100%": { transform: "translateY(0px)", opacity: "0.5" },
          "50%": { transform: "translateY(-20px)", opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};
