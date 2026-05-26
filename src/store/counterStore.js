import { create } from "zustand";

export const useCounterStore = create((set) => ({
  count: 0, // Initial state
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
