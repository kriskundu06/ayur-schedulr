import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { User, Shield, Eye, EyeOff } from "lucide-react";
import ayursutraLogo from "@/assets/ayursutra-logo-circle.png";

export interface User {
  id: string;
  username: string;
  role: 'patient' | 'practitioner';
  fullName?: string;
}

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"patient" | "practitioner">("patient");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple demo authentication
    if ((username === "patient" || username === "practitioner") && password === "demo") {
      const user: User = {
        id: role === "patient" ? "1" : "2",
        username: role,
        role: role,
        fullName: role === "patient" ? "Sarah Johnson" : "Dr. Priya Sharma"
      };
      
      onLogin(user);
      toast({
        title: "Welcome!",
        description: `Logged in as ${user.fullName}`,
      });
    } else {
      toast({
        title: "Authentication failed",
        description: "Use 'patient' or 'practitioner' with password 'demo'",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-accent/20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-calm opacity-60" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <img 
                src={ayursutraLogo} 
                alt="AyurSutra Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              AyurSutra
            </h1>
            <p className="text-muted-foreground">
              Smart Ayurveda Therapy Scheduling for Holistic Care
            </p>
          </motion.div>

          <Card className="shadow-warm border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-foreground">Welcome Back</CardTitle>
              <CardDescription>Sign in to continue your wellness journey</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role Toggle */}
                <div className="flex items-center space-x-1 bg-muted/50 p-1 rounded-lg mb-6">
                  <motion.button
                    type="button"
                    onClick={() => setRole("patient")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      role === "patient" 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <User className="w-4 h-4" />
                    Patient
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setRole("practitioner")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      role === "practitioner" 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Shield className="w-4 h-4" />
                    Practitioner
                  </motion.button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="transition-gentle border-border/50 focus:border-primary"
                    placeholder="Enter your username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="transition-gentle border-border/50 focus:border-primary pr-10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-healing hover:bg-primary/90 transition-gentle shadow-gentle text-white font-medium"
                  >
                    Sign In
                  </Button>
                </motion.div>
                
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Demo: Use "patient" or "practitioner" with password "demo"
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;