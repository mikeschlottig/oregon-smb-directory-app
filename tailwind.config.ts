import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors based on Oregon SMB Directory design
        'directory-blue': '#4F46E5',
        'electrician-gold': '#FFD700',
        'plumber-blue': '#0EA5E9',
        'hvac-orange': '#F97316',
        'contractor-orange': '#EA580C',
        
        // Status colors
        'verified-green': '#10B981',
        'pending-yellow': '#F59E0B',
        'error-red': '#EF4444',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;