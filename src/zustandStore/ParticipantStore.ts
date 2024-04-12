import { create } from "zustand";

interface IViewParticipantsStore {
  selectedTableRows: number;
  setSelectedTableRows: (by: any) => void;
  ParticpantFiltersData: any;
  setParticpantFiltersData: (by: any) => void;
  selectedRowObjects: [];
  setSelectedRowObjects: (by: any) => void;
}

export const ParticipantStore = create<IViewParticipantsStore>((set) => ({
  ParticpantFiltersData: {},
  setParticpantFiltersData: (data: any) => {
    set(() => ({
      ParticpantFiltersData: data,
    }));
  },
  selectedTableRows: 0,
  setSelectedTableRows: (count: any) => {
    set(() => ({
      selectedTableRows: count,
    }));
  },
  selectedRowObjects: [],
  setSelectedRowObjects: (data: any) => {
    set(() => ({
      selectedRowObjects: data,
    }));
  },
}));
