import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],

  server: {
    headers: {
      // This allows the main window to check the status of the pop-up
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
})
