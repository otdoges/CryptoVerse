
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Settings, Bell } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-crypto-dark-card border-b border-crypto-gray px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-r from-crypto-blue to-crypto-purple flex items-center justify-center text-white font-bold text-xl">
              DS
            </div>
            <span className="text-xl font-bold text-white hidden md:inline">DeFiSandbox</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link to="/trade" className="text-gray-300 hover:text-white transition-colors">
                Trade
              </Link>
              <Link to="/portfolio" className="text-gray-300 hover:text-white transition-colors">
                Portfolio
              </Link>
              <Link to="/watchlist" className="text-gray-300 hover:text-white transition-colors">
                Watchlist
              </Link>
            </>
          ) : (
            <>
              <Link to="/features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <button className="text-gray-300 hover:text-white relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-crypto-purple text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="h-8 w-8 rounded-full bg-crypto-blue flex items-center justify-center text-white">
                      {user?.username.charAt(0).toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-crypto-dark-card border-crypto-gray text-white" align="end">
                  <div className="p-2">
                    <p className="font-medium">{user?.username}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-crypto-gray" />
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-crypto-dark-hover flex items-center gap-2"
                    onClick={() => navigate("/profile")}
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-crypto-dark-hover flex items-center gap-2"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-crypto-gray" />
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-crypto-dark-hover flex items-center gap-2 text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white hover:bg-transparent"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button 
                className="bg-crypto-purple hover:bg-purple-600 text-white"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Button>
            </>
          )}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white hover:bg-transparent"
            >
              <Menu size={24} />
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden pt-2 pb-4 px-4 space-y-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="block py-2 px-4 text-gray-300 hover:bg-crypto-dark-hover rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/trade"
                className="block py-2 px-4 text-gray-300 hover:bg-crypto-dark-hover rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trade
              </Link>
              <Link
                to="/portfolio"
                className="block py-2 px-4 text-gray-300 hover:bg-crypto-dark-hover rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Portfolio
              </Link>
              <Link
                to="/watchlist"
                className="block py-2 px-4 text-gray-300 hover:bg-crypto-dark-hover rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Watchlist
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/features"
                className="block py-2 px-4 text-gray-300 hover:bg-crypto-dark-hover rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/about"
                className="block py-2 px-4 text-gray-300 hover:bg-crypto-dark-hover rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
