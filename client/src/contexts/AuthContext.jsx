import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { STORAGE_KEYS } from "../constants/API_ENDPOINTS";
import { setItem, getItem, removeItem } from "../utils/storage";
import { getErrorMessage } from "../utils/errorParser";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getItem(STORAGE_KEYS.USER));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    authService
      .refresh()
      .catch(() => {
        setUser(null);
        removeItem(STORAGE_KEYS.USER);
      });
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const { data } = await authService.login(credentials);
      setUser(data.data);
      setItem(STORAGE_KEYS.USER, data.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload) => {
    setIsLoading(true);
    try {
      const { data } = await authService.register(payload);
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // proceed with local logout regardless
    }
    setUser(null);
    removeItem(STORAGE_KEYS.USER);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};