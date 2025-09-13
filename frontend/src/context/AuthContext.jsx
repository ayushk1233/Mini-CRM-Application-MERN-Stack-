import { createContext, useContext, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = (data) => {
    const userData = {
      ...data,
      role: data.role || 'user' // ensure role is always set
    };
    setUser(userData);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);
    toast.success("Successfully logged in!", {
      icon: "🎉",
      duration: 3000,
    });
  };

  const register = (data) => {
    // Handle the registration response similar to login
    const userData = {
      ...data,
      role: data.role || 'user'
    };
    setUser(userData);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);
    toast.success("Successfully registered!", {
      icon: "✨",
      duration: 3000,
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Successfully logged out!", {
      icon: "👋",
      duration: 3000,
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "glassmorphism dark:glassmorphism-dark",
          style: {
            background: "rgba(255, 255, 255, 0.7)",
            color: "#1a1a1a",
          },
          dark: {
            style: {
              background: "rgba(30, 30, 30, 0.7)",
              color: "#fff",
            },
          },
        }}
      />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
