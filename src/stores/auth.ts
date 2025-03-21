import { defineStore } from "pinia";
import api from "../config/api";

interface User {
  id: number;
  name: string;
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
  }),
  actions: {
    async login(username: string, password: string): Promise<void> {
      try {
        const response = await api.post<User>("/login", {
          login_id: username,
          password,
        });

        this.user = response.data;
        this.token = response.data.token;
        localStorage.setItem("token", response.data.token);
      } catch (error) {
        throw new Error("Login failed. Please check your credentials.");
      }
    },
    async logout(): Promise<void> {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
    async checkAuth(): Promise<boolean> {
      try {
        await api.get("/user/profile");
        return true;
      } catch {
        this.logout();
        return false;
      }
    },
  },
});
