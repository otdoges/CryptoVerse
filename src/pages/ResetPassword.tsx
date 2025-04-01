
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { resetPassword } from "@/services/supabaseService";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's an access token in the URL (this means the user came from a reset password email)
    const checkAccessToken = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error checking session:", error);
        return;
      }
      setHasAccessToken(!!data.session);
    };
    
    checkAccessToken();
  }, []);

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
      await resetPassword(password);
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasAccessToken) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
          <Card className="w-full max-w-md bg-crypto-dark-card border-crypto-gray shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Invalid Reset Link</CardTitle>
              <CardDescription className="text-gray-400">
                This password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Please request a new password reset link or return to login.
              </p>
              <Button
                className="w-full bg-crypto-blue hover:bg-blue-600 text-white"
                onClick={() => navigate("/login")}
              >
                Return to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
        <Card className="w-full max-w-md bg-crypto-dark-card border-crypto-gray shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Reset Your Password</CardTitle>
            <CardDescription className="text-gray-400">
              Please create a new password for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                  New Password
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
                className="w-full bg-crypto-blue hover:bg-blue-600 text-white mt-6"
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
                    Reset Password <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-crypto-gray pt-6">
            <Button 
              variant="link" 
              className="text-crypto-blue hover:text-blue-600"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ResetPassword;
