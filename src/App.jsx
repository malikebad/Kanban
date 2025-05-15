import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import KanbanBoard from "@/components/KanbanBoard";
import SignInPage from "@/components/SignInPage";
import SignUpPage from "@/components/SignUpPage";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ToastProvider as ShadToastProvider } from "@/components/ui/use-toast";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/signin" />;
  }
  return children;
};

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-xl text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <KanbanBoard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to={user ? "/" : "/signin"} />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ShadToastProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <AppContent />
            <Toaster />
          </div>
        </Router>
      </ShadToastProvider>
    </AuthProvider>
  );
}

export default App;