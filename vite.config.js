import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Google Analytics tracking ID (public, no need to hide)
  // Can be overridden via .env file if needed
  const gaTrackingId = env.REACT_APP_GA_TRACKING_ID || 
                       env.VITE_REACT_APP_GA_TRACKING_ID || 
                       env.VITE_GA_TRACKING_ID || 
                       'G-NB3EJY8KJL'
  
  return {
    plugins: [react()],
    base: '/',
    publicDir: 'public',
    define: {
      'process.env.REACT_APP_GA_TRACKING_ID': JSON.stringify(gaTrackingId),
    },
  }
})
