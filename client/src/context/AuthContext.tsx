import React, { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken, clearToken } from "@/services/api";

export interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  role?: string;
  headline?: string;
  targetRole?: string;
  experienceLevel?: string;
  location?: string;
  education?: string;
  college?: string;
  graduationYear?: string;
  bio?: string;
  dailyHours?: number;
  preferredStudyTime?: string;
  daysPerWeek?: number;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const meData = await api.getMe();
      if (meData) {
        setUser(meData.user || meData);
      } else {
        clearToken();
        setUser(null);
      }
    } catch (err) {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await api.login(email, password);
    const token = result.accessToken || result.token;
    if (!token) throw new Error("Login succeeded but no token returned");
    setToken(token);
    if (result.user) {
      setUser(result.user);
    } else {
      await refreshUser();
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    const result = await api.register(fullName, email, password);
    const token = result.accessToken || result.token;
    if (token) {
      setToken(token);
      if (result.user) {
        setUser(result.user);
      } else {
        await refreshUser();
      }
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
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
