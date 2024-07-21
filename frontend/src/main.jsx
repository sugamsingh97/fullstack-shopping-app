import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { ShoppingCartContextProvider } from './context/ShoppingCartContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ShoppingCartContextProvider>
          <App />
        </ShoppingCartContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
