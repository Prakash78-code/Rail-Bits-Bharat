import { createContext, useContext, useState, ReactNode } from "react";

interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: "passenger" | "vendor" | "admin";
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Demo users for development
const DEMO_USERS: AuthUser[] = [
  { uid: "u1", email: "passenger@demo.com", displayName: "Rahul Sharma", role: "passenger" },
  { uid: "u2", email: "vendor@demo.com", displayName: "Sai Tiffin", role: "vendor" },
  { uid: "u3", email: "admin@demo.com", displayName: "Admin User", role: "admin" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  async function login(email: string, _password: string) {
    const found = DEMO_USERS.find(u => u.email === email) ?? DEMO_USERS[0];
    setUser(found);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}