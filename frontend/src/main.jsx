import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import './index.css'
import AuthProvider from './context/AuthContext';
import Routes from './routers/Routes';

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <StrictMode>
      <AuthProvider>
        <Routes></Routes>
      </AuthProvider>
  </StrictMode>,

);
