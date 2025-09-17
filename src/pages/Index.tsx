import { useState, useEffect } from "react";
import LoginForm, { User } from "@/components/auth/LoginForm";
import PatientDashboard from "@/components/dashboard/PatientDashboard";
import PractitionerDashboard from "@/components/dashboard/PractitionerDashboard";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('ayurveda_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('ayurveda_user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('ayurveda_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ayurveda_user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-calm flex items-center justify-center">
        <div className="animate-gentle-pulse">
          <div className="w-16 h-16 bg-gradient-healing rounded-full flex items-center justify-center mb-4">
            <div className="w-8 h-8 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (user.role === 'patient') {
    return <PatientDashboard user={user} onLogout={handleLogout} />;
  }

  return <PractitionerDashboard user={user} onLogout={handleLogout} />;
};

export default Index;
