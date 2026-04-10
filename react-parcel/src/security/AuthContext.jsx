import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
  console.log("🔥 CONTEXT USER UPDATED:", user);
}, [user]);
  // 🔥 Debug: always logs real state changes
  useEffect(() => {
    console.log("🔥 USER STATE CHANGED:", user);
  }, [user]);

  const login = (data) => {
    console.log("🔥 LOGIN CALLED WITH:", data);

    const userData = data.user;

    // set state
    setUser(userData);

    // persist to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access", data.access);

    console.log("Logged in user:", userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access");

    console.log("👋 User logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);