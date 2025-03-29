import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAuthSlice } from "./Slice/Auth-slice";
import { createBookingSlice } from "./Slice/Booking-slice";

export const useAppStore=create(
    persist(
        (set,get)=>({
            ...createAuthSlice(set,get),
            ...createBookingSlice(set,get),
        }),
        {
            name:"Store-data",
            getStore:()=>localStorage,
        }
    )
)