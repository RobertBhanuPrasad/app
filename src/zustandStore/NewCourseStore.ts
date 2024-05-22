import { create } from "zustand";

interface NewCourseStore {
  viewPreviewPage: boolean;
  viewThankyouPage: boolean;
  viewSuccessModal: boolean;
  viewRejectedModal: boolean;
  viewCourseAccountingSuccessModal: boolean;
  viewCourseAccountingRejectedDescriptionModal: boolean;
  viewCourseAccountingRejectedModal: boolean;
  newCourseAlertMessageModal: boolean;

  setViewRejectedModal: (by: boolean) => void;
  setViewPreviewPage: (by: boolean) => void;
  setViewThankyouPage: (by: boolean) => void;
  setViewSuccessModal: (by: boolean) => void;
  setViewCourseAccountingSuccessModal: (by: boolean) => void;
  setViewCourseAccountingRejectedDescriptionModal: (by: boolean) => void;
  setViewCourseAccountingRejectedModal: (by: boolean) => void;
  newCourseData: any;
  setNewCourseData: (by: any) => void;
  newAdvanceFilterData: any;
  setNewAdvanceFilterData: (by: any) => void;
  currentStep: number; // Corrected the type to number
  setCurrentStep: (by: number) => void;
  AllFilterData: any;
  setAllFilterData: (by: any) => void;
  programId: number;
  setProgramId: (by: number) => void;
  setProgramCreatedById : (by: any) => void;
  setNewCourseAlertMessageModal: (by: boolean) => void;
  /**
   * This variable is used to store the id of the program created by id
   * which is i am organizing or i am teaching or i am co-teaching
   */
  programCreatedById :any

  /**
   * We have to use this variable to store the default values of the course accounting form
   * when user click on  edit course accounting form
   * when user click on edit call database and set to this variable and assign to form
   */
  courseAccountingFormDefaultValues: CourseAccountingFormFieldTypes;

  /**
   * This function is used to store course accounting form default values
   * @param by this is CourseAccountingFormFieldTypes
   * @returns void
   */
  setCourseAccountingFormDefaultValues: (
    by: CourseAccountingFormFieldTypes
  ) => void;
}

export const newCourseStore = create<NewCourseStore>((set) => ({
  viewPreviewPage: false,
  viewThankyouPage: false,
  newCourseData: null,
  programId: 1,
  viewSuccessModal: false,
  viewRejectedModal: false,
  newCourseAlertMessageModal: false,
  viewCourseAccountingSuccessModal: false,
  viewCourseAccountingRejectedDescriptionModal: false,
  viewCourseAccountingRejectedModal: false,

  courseAccountingFormDefaultValues: {},
  programCreatedById:null,
  setViewRejectedModal: (data: boolean) => {
    set(() => ({
      viewRejectedModal: data,
    }));
  },
  setViewSuccessModal: (data: boolean) => {
    set(() => ({
      viewSuccessModal: data,
    }));
  },
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
  setCourseAccountingFormDefaultValues: (
    data: CourseAccountingFormFieldTypes
  ) => {
    set(() => ({
      courseAccountingFormDefaultValues: data,
    }));
  },
  setViewCourseAccountingSuccessModal: (data: boolean) => {
    set(() => ({
      viewCourseAccountingSuccessModal: data,
    }));
  },
  setViewCourseAccountingRejectedDescriptionModal: (data: boolean) => {
    set(() => ({
      viewCourseAccountingRejectedDescriptionModal: data,
    }));
  },
  setViewCourseAccountingRejectedModal: (data: boolean) => {
    set(() => ({
      viewCourseAccountingRejectedModal: data,
    }));
  },
  setProgramCreatedById : (data: any) => {
    set(() => ({
      programCreatedById:data,
    }))
  },
  setNewCourseAlertMessageModal : (data: boolean) => {
    set(() => ({
      newCourseAlertMessageModal:data,
    }))
  }
}));
