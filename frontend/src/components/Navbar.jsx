import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LogOut, UploadCloud, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                TutoRoot
              </span>
            </div>
            <div className="ml-8 flex items-center space-x-1">
              <Link
                to="/dashboard"
                className="text-foreground/80 hover:text-primary hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
              </Link>
              <Link
                to="/upload"
                className="text-foreground/80 hover:text-primary hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <UploadCloud className="w-4 h-4 mr-2" /> New Upload
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-muted-foreground mr-2">
              {user.email}
            </span>
            <button
              onClick={logout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-full transition-colors flex items-center justify-center"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
