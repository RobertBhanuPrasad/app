import { create } from "zustand";

interface stepStoreStore {
  currentStep: number;
  setCurrentStep: (by: number) => void;
}

export const stepStore = create<stepStoreStore>((set) => ({
    currentStep: 1,
  setCurrentStep: (data: number) => {
    set(() => ({
        currentStep: data,
    }));
  },
}));
