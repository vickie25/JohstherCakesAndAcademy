import { createContext, useContext, useState, type ReactNode } from 'react';

type User = {
  name: string;
  email: string;
  avatar?: string;
};

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, name?: string) => {
    // Simulate login
    setUser({
      name: name || email.split('@')[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${email}&backgroundColor=F59E0B`,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
