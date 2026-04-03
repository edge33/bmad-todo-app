/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366F1",
          dark: "#4F46E5",
        },
        text: {
          primary: "#1F2937",
          secondary: "#6B7280",
        },
        surface: {
          lighter: "#F9FAFB",
        },
      },
      spacing: {
        xs: "0.25rem",
        md: "1rem",
        lg: "1.5rem",
      },
      borderRadius: {
        lg: "0.5rem",
      },
    },
  },
  plugins: [],
};
