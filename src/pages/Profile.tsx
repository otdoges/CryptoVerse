
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/services/supabaseService";
import { User, Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
    
    if (user) {
      setUsername(user.username);
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateUserProfile(user.id, username);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Profile</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="bg-crypto-dark-card border-crypto-gray">
              <CardHeader className="pb-0">
                <CardTitle className="text-white">Account</CardTitle>
                <CardDescription className="text-gray-400">
                  Your personal account information
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-crypto-blue to-crypto-purple flex items-center justify-center text-white text-3xl font-bold mb-4">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{user.username}</h3>
                  <p className="text-gray-400 mt-1">{user.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="bg-crypto-dark-card border-crypto-gray">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Personal Information</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage your personal information
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="bg-transparent border-crypto-gray hover:bg-crypto-dark-hover"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setIsEditing(false);
                          if (user) setUsername(user.username);
                        }}
                        className="bg-transparent border-crypto-gray hover:bg-crypto-dark-hover"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleSaveProfile}
                        className="bg-crypto-blue hover:bg-blue-600"
                        disabled={isSaving}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-gray-300">Username</Label>
                      <div className="relative">
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={!isEditing}
                          className={`bg-crypto-dark border-crypto-gray text-white pl-9 ${!isEditing ? 'opacity-80' : ''}`}
                        />
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                        className="bg-crypto-dark border-crypto-gray text-white opacity-80"
                      />
                    </div>
                  </div>
                </form>
                
                <div className="border-t border-crypto-gray mt-8 pt-8">
                  <h3 className="text-lg font-medium text-white mb-4">Account Security</h3>
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/reset-password")}
                      className="w-full md:w-auto bg-transparent border-crypto-gray hover:bg-crypto-dark-hover text-white"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
