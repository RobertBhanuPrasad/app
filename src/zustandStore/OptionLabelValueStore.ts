import { create } from "zustand";

interface OptionLabelValueStore {
  optionLabelValue: any[];
  setOptionLabelValue: (by: any[]) => void;
}

export const optionLabelValueStore = create<OptionLabelValueStore>((set) => ({
  optionLabelValue: [],
  setOptionLabelValue: (data: any[]) => {
    set(() => ({
      optionLabelValue: data,
    }));
  },
}));
