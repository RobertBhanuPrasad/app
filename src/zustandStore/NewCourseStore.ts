import { create } from "zustand";

interface NewCourseStore {
  viewPreviewPage: boolean;
  viewThankyouPage: boolean;
  setViewPreviewPage: (by: boolean) => void;
  setViewThankyouPage: (by: boolean) => void;
  newCourseData: any;
  setNewCourseData: (by: any) => void;
}

export const newCourseStore = create<NewCourseStore>((set) => ({
  viewPreviewPage: false,
  viewThankyouPage: false,
  newCourseData: {},
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
}));
