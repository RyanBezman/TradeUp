"use client";
import {
  Dispatch,
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  useEffect,
} from "react";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  sessionToken: string;
  city: string;
  state: string;
  phone: string;
  zip: string;
  id: number;
  job?: string | null;
};
type Balance = {
  asset: string;
  balance: string;
};
type AuthContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  logout: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  balance: Balance | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  initialUser,
  initialBalances,
}: {
  children: ReactNode;
  initialUser: User | null;
  initialBalances: Balance | null;
}) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [balance, setBalance] = useState<Balance | null>(initialBalances);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, theme, toggleTheme, balance }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
