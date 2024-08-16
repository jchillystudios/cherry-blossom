import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// screen.orientation.lock('landscape').then( () => {
// });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)