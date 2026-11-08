import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/great-vibes/400.css'
import '@fontsource/quicksand/400.css'
import '@fontsource/quicksand/600.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'
import '@fontsource/cormorant-garamond/400-italic.css'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
