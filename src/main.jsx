import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Test from './Test'
import Identity from './pages/Identity'
import AppAuth from './pages/AppAuth'
import Grievance from './pages/Grievance'
import Dashboard from './pages/Dashboard'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/test" element={<Test />} />
        <Route path="/identity" element={<Identity />} />
        <Route path="/app-auth" element={<AppAuth />} />
        <Route path="/grievance" element={<Grievance />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
