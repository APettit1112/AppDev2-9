import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const VALID_ROLES = ['regular', 'admin'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (username, password, role = 'regular') => {
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('Username and password are required');
    }

    const normalizedUsername = username.trim();

    if (!normalizedUsername || !password.trim()) {
      throw new Error('Username and password are required');
    }

    if (!VALID_ROLES.includes(role)) {
      throw new Error('User role must be regular or admin');
    }

    setUser({ username: normalizedUsername, role });
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: user !== null,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
