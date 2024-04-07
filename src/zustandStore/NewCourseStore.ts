import { create } from 'zustand'

interface NewCourseStore {
  viewPreviewPage: boolean
  viewThankyouPage: boolean
  viewNewCoursePage: boolean
  setViewPreviewPage: (by: boolean) => void
  setViewThankyouPage: (by: boolean) => void
  setViewNewCoursePage: (by: boolean) => void
  newCourseData: any
  setNewCourseData: (by: any) => void
  currentStep: number // Corrected the type to number
  setCurrentStep: (by: number) => void
}

export const newCourseStore = create<NewCourseStore>(set => ({
  viewPreviewPage: false,
  viewThankyouPage: false,
  viewNewCoursePage: false,
  newCourseData: {},
  setViewPreviewPage: (data: boolean) => {
    set(() => ({
      viewPreviewPage: data
    }))
  },
  setViewThankyouPage: (data: boolean) => {
    set(() => ({
      viewThankyouPage: data
    }))
  },
  setViewNewCoursePage: (data: boolean) => {
    set(() => ({
      viewNewCoursePage: data
    }))
  },
  setNewCourseData: (data: any) => {
    set(() => ({
      newCourseData: data
    }))
  },
  currentStep: 1,
  setCurrentStep: (data: number) => {
    set(() => ({
      currentStep: data
    }))
  }
}))
