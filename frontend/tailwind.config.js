// tailwind.config.js
module.exports = {
    darkMode: 'class', // enables class-based dark mode toggling
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
      extend: {
        colors: {
          neon: '#39ff14',
          background: '#0d1117',
        },
      },
    },
    plugins: [],
  };
  