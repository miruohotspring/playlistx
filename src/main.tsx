import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import PxAppBar from './components/PxAppBar.tsx'
import { CssBaseline } from '@mui/material'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssBaseline />
    <PxAppBar />
    <App />
  </React.StrictMode>
)
