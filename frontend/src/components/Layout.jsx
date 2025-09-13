import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { 
  LogOut, 
  Sun,
  Moon,
  LayoutDashboard,
  Users 
} from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useDarkMode();

  const isActivePath = (path) => {
    return location.pathname === path ||
      (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed inset-y-0 left-0 w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700 shadow-lg dark:text-gray-100 z-30"
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">CS</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              ClientSphere
            </h1>
          </motion.div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
              isActivePath('/dashboard')
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link
            to="/customers"
            className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
              isActivePath('/customers')
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Customers
          </Link>
        </nav>

        {user && (
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{user.name?.[0]?.toUpperCase()}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 space-x-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Main Content */}
      <main className="transition-all duration-200 ease-in-out md:ml-64 min-h-screen">
        {/* Top Bar */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Welcome back, {user?.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Page Content */}
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
