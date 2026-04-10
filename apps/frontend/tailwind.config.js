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
        task: {
          "active-light": "#F5F3FF",
          "complete-light": "#E8F5E9",
          "accent-light": "#6366F1",
          "bg-light": "#FFFFFF",
          "text-primary": "#4a4a4a",
          "text-secondary": "#6B7280",
          "text-heading": "#2c2c2c",
          "text-complete": "#2d5a3d",
          "text-complete-secondary": "#3d7a5a",
          "border-complete": "#22c55e",
          "active-dark": "#334155",
          "complete-dark": "#1e293b",
          "accent-dark": "#818cf8",
          "bg-dark": "#0f172a",
          "text-dark-primary": "#F1F5F9",
          "text-dark-secondary": "#94a3b8",
          "text-dark-complete": "#6ee7b7",
          "text-dark-complete-secondary": "#34d399",
          "border-dark": "#475569",
          "border-dark-subtle": "#334155",
        },
      },
      spacing: {
        "task-xs": "4px",
        "task-sm": "8px",
        "task-gap": "16px",
        "task-md": "16px",
        "task-lg": "24px",
        "task-xl": "32px",
      },
      borderRadius: {
        task: "12px",
      },
      fontSize: {
        h1: ["28px", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["20px", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        small: ["14px", { lineHeight: "1.4", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};
