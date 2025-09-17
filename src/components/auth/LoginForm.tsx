import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Shield, Heart } from "lucide-react";

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
  const [role, setRole] = useState<'patient' | 'practitioner'>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock users for demo
  const mockUsers = {
    patient: { id: '1', username: 'patient', password: 'demo', role: 'patient' as const, fullName: 'Sarah Johnson' },
    practitioner: { id: '2', username: 'practitioner', password: 'demo', role: 'practitioner' as const, fullName: 'Dr. Priya Sharma' }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple auth simulation
    setTimeout(() => {
      const mockUser = mockUsers[role];
      if (username === mockUser.username && password === mockUser.password) {
        onLogin(mockUser);
        toast({
          title: "Welcome back!",
          description: `Logged in as ${mockUser.fullName}`,
        });
      } else {
        toast({
          title: "Authentication failed",
          description: "Invalid credentials. Try 'demo' for both fields.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-warm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-healing rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">AyurVeda Clinic</CardTitle>
          <CardDescription>Welcome to your healing journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">I am a:</Label>
              <Select value={role} onValueChange={(value: 'patient' | 'practitioner') => setRole(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Patient
                    </div>
                  </SelectItem>
                  <SelectItem value="practitioner">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Practitioner
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username (demo: patient/practitioner)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password (demo: demo)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-healing hover:bg-primary/90 transition-gentle"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-sm text-muted-foreground text-center">
              Demo credentials: username & password both "demo"
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;