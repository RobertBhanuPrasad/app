import { create } from "zustand";

interface NewCourseStore {
  viewPreviewPage: boolean;
  setViewPreviewPage: (by: boolean) => void;
  newCourseData: Program;
  setNewCourseData: (by: Program) => void;
  currentStep: number; // Corrected the type to number
  setCurrentStep: (by: number) => void;
}

export const newCourseStore = create<NewCourseStore>((set) => ({
  viewPreviewPage: false,
  setViewPreviewPage: (data: boolean) => {
    set(() => ({
      viewPreviewPage: data,
    }));
  },
  newCourseData: {},
  setNewCourseData: (data: Program) => {
    set(() => ({
      newCourseData: data,
    }));
  },
  currentStep: 1,
  setCurrentStep: (data: number) => {
    set(() => ({
      currentStep: data,
    }));
  },
}));
