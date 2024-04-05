import { create } from "zustand";

interface NewCourseStore {
  viewPreviewPage: boolean;
  setViewPreviewPage: (by: boolean) => void;
  newCourseData: any;
  setNewCourseData: (by: any) => void;
  viewThankyouPage: boolean;
  setViewThankyouPage: (by: boolean) => void;
}

export const newCourseStore = create<NewCourseStore>((set) => ({
  viewPreviewPage: false,
  setViewPreviewPage: (data: boolean) => {
    set(() => ({
      viewPreviewPage: data,
    }));
  },
  newCourseData: {},
  setNewCourseData: (data: any) => {
    set(() => ({
      newCourseData: data,
    }));
  },

  viewThankyouPage: false,
  setViewThankyouPage: (data: boolean) => {
    set(() => ({
      viewPreviewPage: data,
    }));
  },
}));
