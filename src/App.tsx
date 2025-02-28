
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Index from "@/pages/Index";
import PropertyDetails from "@/pages/PropertyDetails";
import NotFound from "@/pages/NotFound";

function App() {
  // Temporarily bypass login - always consider the user as authenticated
  const [isAuthenticated] = useState(true);
  
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        />
        <Route path="/" element={<Index />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <SonnerToaster position="top-right" />
      <Toaster />
    </Router>
  );
}

export default App;
