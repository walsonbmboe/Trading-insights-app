import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
// @ts-ignoreimport 
import awsconfig from "./aws-exports.js"; 
import App from './App.tsx';
import './index.css';

Amplify.configure(awsconfig.default); 


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
