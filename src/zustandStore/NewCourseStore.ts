import { create } from "zustand";

interface NewCourseStore {
    viewPreviewPage: boolean;
    viewThankyouPage: boolean;
    setViewPreviewPage: (by: boolean) => void;
    setViewThankyouPage: (by: boolean) => void;
    newCourseData: Program;
    setNewCourseData: (by: Program) => void;
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
    setNewCourseData: (data: Program) => {
        set(() => ({
            newCourseData: data,
        }));
    },
}));
