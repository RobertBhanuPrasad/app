import { create } from "zustand";
interface newEventStore {
  currentEventStep: number; // Corrected the type to number
  setCurrentEventStep: (by: number) => void;
}
export const newEventStore = create<newEventStore>((set) => ({
  currentEventStep: 1,
  setCurrentEventStep: (data: number) => {
    set(() => ({
      currentEventStep: data,
    }));
  },
}))