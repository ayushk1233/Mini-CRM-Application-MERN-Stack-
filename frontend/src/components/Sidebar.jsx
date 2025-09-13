import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  BarChart3, 
  Settings,
  Menu,
  X
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/customers', icon: Users, label: 'Customers' },
  { path: '/leads', icon: Target, label: 'Leads' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' }
];

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const NavLink = ({ path, icon: Icon, label }) => {
    const isActive = location.pathname === path;
    
    return (
      <Link
        to={path}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
          }`}
      >
        <Icon size={20} className={isActive ? 'text-blue-600 dark:text-blue-400' : ''} />
        <span className="font-medium">{label}</span>
        {isActive && (
          <motion.div
            className="absolute left-0 w-1 h-8 bg-blue-600 dark:bg-blue-400 rounded-r-full"
            layoutId="activeTab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg md:hidden"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <AnimatePresence mode="wait">
        <motion.div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 transform 
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 transition-transform duration-200 ease-in-out
            border-r border-gray-200 dark:border-gray-800`}
          initial={false}
        >
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">CS</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                ClientSphere
              </h1>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink key={item.path} {...item} />
            ))}
          </nav>
        </motion.div>
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
