import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useContext } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero.jsx";
import Features from "./pages/Features.jsx";
import Vehicle from "./pages/Vehicle.jsx"; // Vehicle page in JSX
import Fine from "./pages/Fine.jsx";
import Toll from "./pages/Toll.jsx";
import Transaction from "./pages/Transaction.jsx";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LearnMore from "./pages/LearnMore";

import { AuthProvider, AuthContext } from "./context/AuthContext";

// ✅ PrivateRoute wrapper for protected pages
function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

// ✅ Layout to conditionally show/hide Navbar/Footer
function Layout({ children }) {
  const location = useLocation();

  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  const hideFooter = ["/login", "/register", "/"].includes(location.pathname);
  const isHero = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className={isHero ? "" : "p-4"}>{children}</div>
      {!hideFooter && <Footer />}
    </>
  );
}

// ✅ Main App
function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<Hero />} />

            {/* Features page (public) */}
            <Route path="/features" element={<Features />} />
            
            {/* Feature subpages */}
            <Route
              path="/features/vehicles"
              element={
                <PrivateRoute>
                  <Vehicle />
                </PrivateRoute>
              }
            />
            {/* Add placeholders for other feature subpages if needed */}
            <Route
              path="/features/fines"
              element={
                <PrivateRoute>
                  <Fine />
                </PrivateRoute>
              }
            />
            <Route
              path="/features/toll"
              element={
                <PrivateRoute>
                  <Toll />
                </PrivateRoute>
              }
            />
            <Route
              path="/features/transactions"
              element={
                <PrivateRoute>
                  <Transaction />
                </PrivateRoute>
              }
            />

            {/* Protected dashboard */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/LearnMore"
              element={
                <PrivateRoute>
                  <LearnMore />
                </PrivateRoute>
              }
            />

            {/* Auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;