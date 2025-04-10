
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-campus-800">
          <div className="bg-campus-600 text-white p-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9v6l-2 2v1h18v-1l-2-2V9c0-3.87-3.13-7-7-7z" />
              <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2z" />
            </svg>
          </div>
          CampusVoice
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-campus-100 flex items-center justify-center text-campus-600">
                <User className="h-4 w-4" />
              </div>
              
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
