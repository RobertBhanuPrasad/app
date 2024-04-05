import { create } from "zustand";

interface NewCourseStore {
  viewPreviewPage: boolean;
  setViewPreviewPage: (by: boolean) => void;
  newCourseData: any;
  setNewCourseData: (by: any) => void;
  newAdvanceFilterData: any;
  setNewAdvanceFilterData: (by: any) => void;
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
  newAdvanceFilterData: {},
  setNewAdvanceFilterData: (data: any) => {
    set(() => ({
      newAdvanceFilterData: data,
    }));
  },
}));
