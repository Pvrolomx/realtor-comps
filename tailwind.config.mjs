/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A5F',
        secondary: '#2E86AB',
        accent: '#F18F01',
        success: '#4CAF50',
        warning: '#FFC107',
      }
    },
  },
  plugins: [],
}
