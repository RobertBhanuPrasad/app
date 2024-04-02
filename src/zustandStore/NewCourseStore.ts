import { create } from "zustand";

interface newCourseStoreType {
    viewPreviewPage: boolean;
    viewThankyouPage: boolean;
    setViewPreviewPage: Function;
    setViewThankyouPage: Function;
}

export const newCourseStore = create<newCourseStoreType>((set) => ({
    viewPreviewPage: false,
    viewThankyouPage: false,
    setViewPreviewPage: (value: boolean) => {
        set(() => ({
            viewPreviewPage: value,
        }));
    },
    setViewThankyouPage: (value: boolean) => {
        set(() => ({
            viewThankyouPage: value,
        }));
    },
}));
