import { create } from "zustand";
import type { User } from "../types/user";
import { api } from "../config/api";

import axios from "axios";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoding: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginError: string | null;
  getUser: () => Promise<void>;
  clearLoginError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loginError: null,
  isAuthLoding: true,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  clearLoginError: () => {
    set({
      loginError: null,
    });
  },

  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      get().setUser(response.data.user);
      set({ isAuthenticated: true });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({
          loginError: error.response?.data?.message ?? "Login failed",
        });
      } else {
        set({
          loginError: "Login failed",
        });
      }
      throw error;
    } finally {
      set({ isAuthLoding: false });
    }
  },

  logout: async () => {
    set({ isAuthLoding: true });
    try {
      await api.post("/auth/logout");
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          loginError: error.response?.data?.message ?? "Login failed",
        });
      } else {
        set({
          loginError: "Login failed",
        });
      }
      throw error;
    } finally {
      set({ isAuthLoding: false, loginError: null });
    }
  },

  register: async (email, password, name) => {
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        name,
      });
      get().setUser(response.data.user);
      set({ isAuthenticated: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          loginError: error.response?.data?.message ?? "Login failed",
        });
      } else {
        set({
          loginError: "Login failed",
        });
      }
      throw error;
    } finally {
      set({ isAuthLoding: false });
    }
  },
  getUser: async () => {
    try {
      const response = await api.get("/auth/me");
      get().setUser(response.data.user);
      set({ isAuthenticated: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          loginError: error.response?.data?.message ?? "Login failed",
        });
      } else {
        set({
          loginError: "Login failed",
        });
      }
      throw error;
    } finally {
      set({ isAuthLoding: false });
    }
  },
}));
