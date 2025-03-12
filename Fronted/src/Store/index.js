import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAuthSlice } from "./Slice/Auth-slice";

export const useAppStore=create(
    persist(
        (set,get)=>({
            ...createAuthSlice(set,get)
        }),
        {
            name:"Store-data",
            getStore:()=>localStorage,
        }
    )
)