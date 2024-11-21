"use client";
import { validateUserSession } from "@/actions/auth/validateUserSession";
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
};
type AuthContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log(document.cookie);
    async function validateSession() {
      const storedCookies = document.cookie
        .split("; ")
        .reduce((acc, cookie) => {
          const [key, value] = cookie.split("=");
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
      const sessionToken = storedCookies.sessionToken;
      const email = storedCookies.email;

      if (sessionToken && email) {
        const isValid = await validateUserSession(email, sessionToken);
        console.log(isValid);
        if (isValid) {
          setUser(isValid);
        } else {
          document.cookie = "sessionToken=; path=/; max-age=0";
          document.cookie = "email=; path=/; max-age=0";
        }
      }
    }
    validateSession();
  }, []);

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
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
