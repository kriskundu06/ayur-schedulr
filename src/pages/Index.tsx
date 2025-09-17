import { useState, useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import PatientDashboard from "@/components/dashboard/PatientDashboard";
import PractitionerDashboard from "@/components/dashboard/PractitionerDashboard";
import Landing from "./Landing";

interface User {
  username: string;
  role: "patient" | "practitioner";
  fullName?: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  // Check for existing session on load
  useEffect(() => {
    const savedUser = localStorage.getItem("panchakarma_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("panchakarma_user");
      }
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("panchakarma_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("panchakarma_user");
    setUser(null);
    setShowLogin(false);
  };

  const handleGetStarted = () => {
    setShowLogin(true);
  };

  if (!user && !showLogin) {
    return <Landing onGetStarted={handleGetStarted} />;
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (user.role === "patient") {
    return <PatientDashboard user={user} onLogout={handleLogout} />;
  }

  return <PractitionerDashboard user={user} onLogout={handleLogout} />;
};

export default Index;