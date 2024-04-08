import { create } from "zustand";

interface NewCourseStore {
  viewPreviewPage: boolean;
  viewThankyouPage: boolean;
  setViewPreviewPage: (by: boolean) => void;
  newCourseData: any;
  setNewCourseData: (by: any) => void;
  newAdvanceFilterData: any;
  setNewAdvanceFilterData: (by: any) => void;
  setViewThankyouPage: (by: boolean) => void;
  currentStep: number; // Corrected the type to number
  setCurrentStep: (by: number) => void;
  AllFilterData: any;
  setAllFilterData: (by: any) => void;
  programId: number;
  setProgramId: (by: number) => void;
}

export const newCourseStore = create<NewCourseStore>((set) => ({
  viewPreviewPage: false,
  viewThankyouPage: false,
  newCourseData: null,
  programId: 1,
  setViewPreviewPage: (data: boolean) => {
    set(() => ({
      viewPreviewPage: data,
    }));
  },
  setViewThankyouPage: (data: boolean) => {
    set(() => ({
      viewThankyouPage: data,
    }));
  },
  setNewCourseData: (data: any) => {
    set(() => ({
      newCourseData: data,
    }));
  },
  newAdvanceFilterData: {},
  setNewAdvanceFilterData: (data: any) => {
    set(() => ({
      newAdvanceFilterData: data,
    }));
  },
  currentStep: 1,
  setCurrentStep: (data: number) => {
    set(() => ({
      currentStep: data,
    }));
  },
  AllFilterData: {},
  setAllFilterData: (data: any) => {
    set(() => ({
      AllFilterData: data,
    }));
  },
  setProgramId: (data: number) => {
    set(() => ({
      programId: data,
    }));
  },
}));
