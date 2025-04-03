import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Bell, Shield, User, LogOut } from "lucide-react";

const Settings = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  
  // Sample settings state (in a real app, these would be loaded from and saved to the backend)
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: {
      email: true,
      push: false,
      marketAlerts: true,
      newFeatures: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: true
    }
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Fixed the spread operator type issue by ensuring we're working with object types
  const updateSetting = (category: keyof typeof settings, setting: string, value: boolean) => {
    setSettings(prev => {
      // Create a copy of the current category settings
      const updatedCategory = { 
        ...prev[category] as Record<string, boolean> 
      };
      
      // Update the specific setting
      updatedCategory[setting] = value;
      
      // Return the updated settings object
      return {
        ...prev,
        [category]: updatedCategory
      };
    });
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
          <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="bg-crypto-dark-card border-crypto-gray">
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <button 
                    onClick={() => setActiveTab("general")}
                    className={`flex items-center gap-3 px-4 py-3 text-left ${
                      activeTab === "general" 
                        ? "bg-crypto-dark-hover text-white" 
                        : "text-gray-400 hover:bg-crypto-dark-hover hover:text-white"
                    }`}
                  >
                    <SettingsIcon size={18} />
                    <span>General</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab("notifications")}
                    className={`flex items-center gap-3 px-4 py-3 text-left ${
                      activeTab === "notifications" 
                        ? "bg-crypto-dark-hover text-white" 
                        : "text-gray-400 hover:bg-crypto-dark-hover hover:text-white"
                    }`}
                  >
                    <Bell size={18} />
                    <span>Notifications</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab("security")}
                    className={`flex items-center gap-3 px-4 py-3 text-left ${
                      activeTab === "security" 
                        ? "bg-crypto-dark-hover text-white" 
                        : "text-gray-400 hover:bg-crypto-dark-hover hover:text-white"
                    }`}
                  >
                    <Shield size={18} />
                    <span>Security</span>
                  </button>
                  <button 
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-3 px-4 py-3 text-left text-gray-400 hover:bg-crypto-dark-hover hover:text-white"
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-crypto-dark-hover"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            {activeTab === "general" && (
              <Card className="bg-crypto-dark-card border-crypto-gray">
                <CardHeader>
                  <CardTitle className="text-white">General Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your application preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">Dark Mode</h4>
                        <p className="text-sm text-gray-400">Enable dark theme for the application</p>
                      </div>
                      <Switch 
                        checked={settings.darkMode}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, darkMode: checked }))}
                      />
                    </div>
                    
                    <div className="border-t border-crypto-gray pt-6">
                      <Button
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "notifications" && (
              <Card className="bg-crypto-dark-card border-crypto-gray">
                <CardHeader>
                  <CardTitle className="text-white">Notification Preferences</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage how you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">Email Notifications</h4>
                        <p className="text-sm text-gray-400">Receive notifications via email</p>
                      </div>
                      <Switch 
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">Push Notifications</h4>
                        <p className="text-sm text-gray-400">Receive push notifications in-browser</p>
                      </div>
                      <Switch 
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                      />
                    </div>
                    
                    <div className="border-t border-crypto-gray pt-6">
                      <h3 className="text-lg font-medium text-white mb-4">Alert Types</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-white">Market Alerts</h4>
                            <p className="text-sm text-gray-400">Price changes and market movements</p>
                          </div>
                          <Switch 
                            checked={settings.notifications.marketAlerts}
                            onCheckedChange={(checked) => updateSetting('notifications', 'marketAlerts', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-white">New Features</h4>
                            <p className="text-sm text-gray-400">Updates about new platform features</p>
                          </div>
                          <Switch 
                            checked={settings.notifications.newFeatures}
                            onCheckedChange={(checked) => updateSetting('notifications', 'newFeatures', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "security" && (
              <Card className="bg-crypto-dark-card border-crypto-gray">
                <CardHeader>
                  <CardTitle className="text-white">Security Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your account security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <Switch 
                        checked={settings.security.twoFactor}
                        onCheckedChange={(checked) => updateSetting('security', 'twoFactor', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">Session Timeout</h4>
                        <p className="text-sm text-gray-400">Automatically log out after inactivity</p>
                      </div>
                      <Switch 
                        checked={settings.security.sessionTimeout}
                        onCheckedChange={(checked) => updateSetting('security', 'sessionTimeout', checked)}
                      />
                    </div>
                    
                    <div className="border-t border-crypto-gray pt-6">
                      <Button
                        variant="outline"
                        onClick={() => navigate("/reset-password")}
                        className="bg-transparent border-crypto-gray hover:bg-crypto-dark-hover text-white"
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
