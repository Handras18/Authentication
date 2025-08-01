import FloatingShape from "./components/FloatingShape";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { Routes, Route, Navigate } from "react-router";

import EmailVerificationPage from "./pages/EmailVerificationPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import DashboardPage from "./pages/DashboardPage";
import LoadingSpinner from "./components/LoadingSpinner";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (!user.isVerified) {
    return <Navigate to="verify-email" replace />;
  }
  return children;
};

const RedirectAuthemticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/signup"
          element={
            <RedirectAuthemticatedUser>
              <SignUpPage />
            </RedirectAuthemticatedUser>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <RedirectAuthemticatedUser>
              <LoginPage />
            </RedirectAuthemticatedUser>
          }
        ></Route>
        <Route path="/verify-email" element={<EmailVerificationPage />}></Route>
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthemticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthemticatedUser>
          }
        ></Route>
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthemticatedUser>
              <ResetPasswordPage />
            </RedirectAuthemticatedUser>
          }
        ></Route>
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
