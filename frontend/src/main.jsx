import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import './index.css'
import AuthProvider from './context/AuthContext';
import router from './routers/Routes';
import { RouterProvider } from 'react-router-dom';
import { Slide, ToastContainer } from "react-toastify";
import UIProvider from './context/UIProvider';

import { ThemeProvider } from './context/ThemeContext';

const root = document.getElementById("root");

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
      <UIProvider>
        <ThemeProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ThemeProvider>
      </UIProvider>
    </QueryClientProvider>
  </StrictMode>,

);
