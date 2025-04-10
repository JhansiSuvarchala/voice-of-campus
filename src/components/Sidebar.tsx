
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  FileText, 
  CheckSquare, 
  BarChart2, 
  Settings, 
  Users, 
  PlusCircle,
  UserCog
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { to: '/my-issues', label: 'My Issues', icon: <FileText className="h-5 w-5" /> },
    { to: '/new-issue', label: 'Submit Issue', icon: <PlusCircle className="h-5 w-5" /> },
  ];
  
  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { to: '/admin/issues', label: 'All Issues', icon: <FileText className="h-5 w-5" /> },
    { to: '/admin/resolved', label: 'Resolved Issues', icon: <CheckSquare className="h-5 w-5" /> },
    { to: '/admin/analytics', label: 'Analytics', icon: <BarChart2 className="h-5 w-5" /> },
    { to: '/admin/users', label: 'Student Users', icon: <Users className="h-5 w-5" /> },
    { to: '/admin/settings', label: 'Settings', icon: <UserCog className="h-5 w-5" /> },
  ];
  
  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="py-6 px-4">
        <div className="mb-8">
          <div className="uppercase text-xs font-semibold text-gray-500 tracking-wider mb-4 px-2">
            {user?.role === 'admin' ? 'Administrator' : 'Student Portal'}
          </div>
          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto">
          <div className="uppercase text-xs font-semibold text-gray-500 tracking-wider mb-4 px-2">
            Help & Support
          </div>
          <nav className="space-y-1">
            <NavLink
              to="/support"
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Settings className="h-5 w-5" />
              <span>Support</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
