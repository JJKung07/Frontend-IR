import { defineStore } from "pinia";
import api from "../config/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    async login(username, password) {
      try {
        const response = await api.post("/login", { 
          login_id: username, 
          password 
        });
        
        this.user = response.data;
        this.token = response.data.token;
        localStorage.setItem('token', response.data.token);
      } catch (error) {
        throw new Error("Login failed. Please check your credentials.");
      }
    },
    async logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    },
    async checkAuth() {
      try {
        await api.get("/user/profile");
        return true;
      } catch {
        this.logout();
        return false;
      }
    }
  },
});