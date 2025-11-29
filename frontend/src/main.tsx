import './index.css';
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
// @ts-ignoreimport 
import awsconfig from "./aws-exports.js"; 
import App from './App.tsx';


Amplify.configure(awsconfig); 


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
