import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import './assets/css/core/site.css'

// IMPORTANT: ImtekkuStore must be imported BEFORE AppUtils
// because AppUtils.js runs an IIFE that calls window.ImtekkuStore.getItem() on load.
import ImtekkuStore from './utils/ImtekkuStore.js'
import './utils/AppUtils.js'

ImtekkuStore.init().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}).catch((err) => {
  console.error('Failed to init ImtekkuStore', err);
  // Still try to render the app so user sees something instead of a blank page
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
