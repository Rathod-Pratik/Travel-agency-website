import { UserInfo } from "../index";

export const createAuthSlice = (set: any, get: any) => ({
  userInfo: undefined,

  setUserInfo: (userInfo: UserInfo | undefined) =>
    set({
      userInfo,
    }),
});