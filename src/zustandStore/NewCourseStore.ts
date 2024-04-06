import { create } from "zustand";

interface NewCourseStore {
    newCourseData: any;
    viewPreviewPage: boolean;
    viewThankyouPage: boolean;
    programId: number;
    setViewPreviewPage: (by: boolean) => void;
    setProgramId: (by: number) => void;
    setViewThankyouPage: (by: boolean) => void;
    setNewCourseData: (by: any) => void;
}

export const newCourseStore = create<NewCourseStore>((set) => ({
    viewPreviewPage: false,
    viewThankyouPage: false,
    programId: 1,
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
    setProgramId: (data: number) => {
        set(() => ({
            programId: data,
        }));
    },
}));
