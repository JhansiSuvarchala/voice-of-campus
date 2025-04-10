
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import MyIssues from "@/pages/MyIssues";
import IssueDetail from "@/pages/IssueDetail";
import NewIssue from "@/pages/NewIssue";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminIssues from "@/pages/AdminIssues";
import AdminIssueDetail from "@/pages/AdminIssueDetail";
import AdminAnalytics from "@/pages/AdminAnalytics";
import NotFound from "@/pages/NotFound";

// Create a new instance of QueryClient
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-campus-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-campus-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Wrapper for data provider with user
const DataProviderWithUser = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return <DataProvider userId={user?.id}>{children}</DataProvider>;
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <DataProviderWithUser>
              <Routes>
                <Route path="/" element={<Layout />}>
                  {/* Public routes */}
                  <Route index element={<HomePage />} />
                  <Route path="login" element={<LoginPage />} />
                  
                  {/* Protected student routes */}
                  <Route path="dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="my-issues" element={
                    <ProtectedRoute>
                      <MyIssues />
                    </ProtectedRoute>
                  } />
                  <Route path="my-issues/:issueId" element={
                    <ProtectedRoute>
                      <IssueDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="new-issue" element={
                    <ProtectedRoute>
                      <NewIssue />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin routes */}
                  <Route path="admin" element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } />
                  <Route path="admin/issues" element={
                    <AdminRoute>
                      <AdminIssues />
                    </AdminRoute>
                  } />
                  <Route path="admin/issues/:issueId" element={
                    <AdminRoute>
                      <AdminIssueDetail />
                    </AdminRoute>
                  } />
                  <Route path="admin/analytics" element={
                    <AdminRoute>
                      <AdminAnalytics />
                    </AdminRoute>
                  } />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </DataProviderWithUser>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
