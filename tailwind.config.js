// tailwind.config.js
module.exports = {
  content: [
    "./dist/**/*.{js,ts,jsx,tsx}", // adapte selon ton projet
    "./*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        retro: ["Orbitron", "sans-serif"],
      },
      colors: {
        bgdark: "#0f172a",
        panel: "#020617",
        accent: "#22d3ee",
      },
    },
    textShadow: {
      neon: "0 0 5px #f0f, 0 0 10px #f0f, 0 0 20px #0ff, 0 0 40px #0ff",
    },
    keyframes: {
      flicker: {
        "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
        "20%, 24%, 55%": { opacity: "0.8" },
      },
    },
    animation: { flicker: "flicker 2s infinite alternate" },
  },
  plugins: [],
};
