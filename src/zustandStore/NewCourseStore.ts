import { create } from "zustand";

interface NewCourseStore {
  viewPreviewPage: boolean;
  setViewPreviewPage: (by: boolean) => void;
  newCourseData: Program;
  setNewCourseData: (by: Program) => void;
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
}));
