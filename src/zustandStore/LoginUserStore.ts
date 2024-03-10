import { create } from "zustand";

interface LoginUserData{
  loginData: any,
  userData: any
}

interface LoginUserStore {
  loginUserData: LoginUserData;
  setLoginUserData: (by: LoginUserData) => void;
}

export const loginUserStore = create<LoginUserStore>((set) => ({
  loginUserData: {
    loginData: {},
    userData: {}
  },
  setLoginUserData: (data: LoginUserData) =>
    set(() => ({
      loginUserData: data,
    }))
}));
