import { Routes, Route, Navigate } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Home from "./Pages/home";
import Sentiments from "./Pages/Sentiments";
import Portfolio from "./Pages/portfolio";
import AuthPage from "./Pages/AuthPage";  // ← Add this import
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Authenticator.Provider>
      <Routes>
        {/* Public Route - No authentication required */}
        <Route path="/" element={<Home />} />
        
        {/* Auth Route - Where users login/signup */}
        <Route path="/auth" element={<AuthPage />} />  {/* ← Add this route */}
        
        {/* Protected Routes - Require authentication */}
        <Route
          path="/sentiments"
          element={
            <ProtectedRoute>
              <Sentiments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Authenticator.Provider>
  );
}