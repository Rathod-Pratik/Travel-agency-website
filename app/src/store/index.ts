import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAuthSlice } from "./Slice/Auth-slice";

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  userInfo?: UserInfo;
  setUserInfo: (userInfo?: UserInfo) => void;
}

export const useAppStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...createAuthSlice(set, get),
    }),
    {
      name: "Store-data",
    }
  )
);