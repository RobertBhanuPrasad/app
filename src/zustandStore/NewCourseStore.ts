import { create } from "zustand";

interface NewCourseStore {
  viewPreviewPage: boolean;
  viewThankyouPage: boolean;
  setViewPreviewPage: (by: boolean) => void;
  setViewThankyouPage: (by: boolean) => void;
  newCourseData: any;
  setNewCourseData: (by: any) => void;
  currentStep: number; // Corrected the type to number
  setCurrentStep: (by: number) => void;
}

export const newCourseStore = create<NewCourseStore>((set) => ({
  viewPreviewPage: false,
  viewThankyouPage: false,
  newCourseData: null,
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
  currentStep: 1,
  setCurrentStep: (data: number) => {
    set(() => ({
      currentStep: data,
    }));
  },
}));
