const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // 'mono': [
        //   'system-ui',
        //   '-apple-system',
        //   'BlinkMacSystemFont',
        //   "Segoe UI",
        //   "Roboto",
        //   "Oxygen",
        //   "Ubuntu",
        //   "Cantarell",
        //   "Fira Sans",
        //   "Droid Sans",
        //   "Helvetica Neue",
        //   'Arial', 'sans-serif',
        //   ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
}
