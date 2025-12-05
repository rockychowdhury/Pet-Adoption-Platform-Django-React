import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import './index.css'
import AuthProvider from './context/AuthContext';
import Routes from './routers/Routes';
import { Bounce, ToastContainer } from "react-toastify";
import UIProvider from './context/UIProvider';

const root = document.getElementById("root");

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={true}
        pauseOnHover
        transition={Bounce}
      />
      <UIProvider>
        <AuthProvider>
          <Routes></Routes>
        </AuthProvider>
      </UIProvider>
    </QueryClientProvider>
  </StrictMode>,

);
