import { create } from "zustand";

interface ViewParticipantsStore {
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
}));
