
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, AlertCircle, Check } from "lucide-react";
import { oauthLogin } from "@/services/supabaseService";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = (password: string): { score: number; message: string } => {
    let score = 0;
    let message = "";

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    switch (score) {
      case 0:
        message = "Very weak";
        break;
      case 1:
        message = "Weak";
        break;
      case 2:
        message = "Fair";
        break;
      case 3:
        message = "Good";
        break;
      case 4:
        message = "Strong";
        break;
      default:
        message = "";
    }

    return { score, message };
  };

  const { score, message } = passwordStrength(password);
  
  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    if (score < 2) {
      setPasswordError("Password is too weak");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(email, username, password);
      navigate("/dashboard");
    } catch (error: any) {
      setPasswordError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      await oauthLogin(provider);
    } catch (error) {
      console.error(`${provider} login error:`, error);
    }
  };

  return (
    <Card className="w-full max-w-md bg-crypto-dark-card border-crypto-gray shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-white text-center">Create Account</CardTitle>
        <CardDescription className="text-gray-400 text-center">
          Enter your details to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center gap-2 bg-transparent border-crypto-gray hover:bg-crypto-dark-hover"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthLogin('github')}
            className="w-full flex items-center justify-center gap-2 bg-transparent border-crypto-gray hover:bg-crypto-dark-hover"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.16 22 16.416 22 12c0-5.523-4.477-10-10-10z" fill="currentColor" />
            </svg>
            GitHub
          </Button>
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-crypto-gray"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-crypto-dark-card px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-crypto-dark border-crypto-gray text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-gray-300">
              Username
            </Label>
            <Input
              id="username"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-crypto-dark border-crypto-gray text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-crypto-dark border-crypto-gray text-white"
              required
            />
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Password strength:</span>
                  <span className={`text-xs ${
                    score < 2 ? 'text-red-500' :
                    score < 3 ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>{message}</span>
                </div>
                <div className="w-full h-1 bg-crypto-dark-hover rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      score < 2 ? 'bg-red-500' :
                      score < 3 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(score / 4) * 100}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-2 gap-1 mt-2">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    {password.length >= 8 ? <Check size={12} className="text-green-500" /> : <AlertCircle size={12} className="text-gray-500" />}
                    <span>8+ characters</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    {/[A-Z]/.test(password) ? <Check size={12} className="text-green-500" /> : <AlertCircle size={12} className="text-gray-500" />}
                    <span>Uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    {/[0-9]/.test(password) ? <Check size={12} className="text-green-500" /> : <AlertCircle size={12} className="text-gray-500" />}
                    <span>Number</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    {/[^A-Za-z0-9]/.test(password) ? <Check size={12} className="text-green-500" /> : <AlertCircle size={12} className="text-gray-500" />}
                    <span>Special character</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-crypto-dark border-crypto-gray text-white"
              required
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-crypto-purple hover:bg-purple-600 text-white mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              <div className="flex items-center">
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t border-crypto-gray pt-6">
        <div className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-crypto-blue hover:underline font-medium"
          >
            Sign in
          </button>
        </div>
        <div className="text-xs text-center text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
