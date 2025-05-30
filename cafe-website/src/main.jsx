// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/main.css'
import { BrowserRouter } from 'react-router-dom' // 确保导入BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* 确保包裹App组件 */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)