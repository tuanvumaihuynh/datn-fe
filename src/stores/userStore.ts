import { defineStore } from "pinia";
import { UserInfo } from "@/types/common";

export const useUserStore = defineStore({
  id: "user",
  state: (): { userInfo: UserInfo | null; accessToken: string | null } => ({
    userInfo: null,
    accessToken: localStorage.getItem("accessToken"),
  }),
  getters: {
    isAuthenticated(): boolean {
      return !!this.accessToken;
    },
  },
  actions: {
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
    },
    setAccessToken(token: string) {
      localStorage.setItem("accessToken", token);
      this.accessToken = token;
    },
    logout() {
      localStorage.removeItem("accessToken");
      this.accessToken = null;
      this.userInfo = null;
    },
  },
});
