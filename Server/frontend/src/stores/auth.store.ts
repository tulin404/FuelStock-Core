import { create } from "zustand";
import type { AuthStore } from "@/types/types";

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,

    setAuth: (user, token) =>
        set({
            user: user,
            accessToken: token,
            isAuthenticated: true,
            isLoading: false
        }),

    logout: () => 
        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false
        }),

    setLoading: (value) => set({ isLoading: value })    
}));