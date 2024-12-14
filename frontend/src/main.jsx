import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import AllRoutes from './routers/routes';
import './index.css'
import AuthProvider from './context/AuthContext';

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AllRoutes></AllRoutes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,

);
