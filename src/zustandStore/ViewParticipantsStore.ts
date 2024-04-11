import { create } from "zustand";

interface ViewParticipantsStore {
  selectedTableRows: number;
  setSelectedTableRows: (by: any) => void;
  ParticpantFiltersData: any;
  setParticpantFiltersData: (by: any) => void;
}

export const viewParticipantsStore = create<ViewParticipantsStore>((set) => ({
  ParticpantFiltersData: {},
  setParticpantFiltersData: (data: any) => {
    set(() => ({
      ParticpantFiltersData: data,
    }));
  },
  selectedTableRows: 0,
  setSelectedTableRows: (count: any) => {
    console.log("STATE", count);
    set(() => ({
      selectedTableRows: count,
    }));
  },
}));
