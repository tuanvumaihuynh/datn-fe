import axios from "axios";
import NProgress from "nprogress";

import { useToast } from "@/components/ui/toast/use-toast";
import { toLogin } from "@/router";
import { useRequestStore } from "@/stores";

NProgress.configure({ showSpinner: false, trickleSpeed: 200 });
// let respSet = new Set();
// const resetRespSet = () => (respSet = new Set());

Object.assign(axios.defaults, {
  baseURL: import.meta.env.VITE_BASE_API_URL,
  timeout: 20000,
});

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.request.use(async (config) => {
  // @ts-ignore
  if (!config.doNotShowLoading) {
    const requestStore = useRequestStore();
    if (!requestStore.requestQueueSize) {
      NProgress.start();
    }
    requestStore.incrementRequestQueueSize();
  }
  return config;
});

const isTokenExpired = (status: number, data: any) =>
  status === 401 && ["TOKEN_EXPIRED", "INVALID_TOKEN"].includes(data.code);

axios.interceptors.response.use(
  (response) => {
    // @ts-ignore
    if (!response.config.doNotShowLoading) {
      setProgressBarDone();
    }
    return response;
  },
  async (error) => {
    // @ts-ignore
    if (!error.config.doNotShowLoading) {
      setProgressBarDone();
    }
    if (error.response) {
      let { data, status } = error.response;

      if (isTokenExpired(status, data)) {
        const { toast } = useToast();
        await toast({
          title: "Token expired",
          description: "Your token has expired, please login again",
          variant: "destructive",
        });
        toLogin();
        return Promise.reject(error);
      }
      if (status === 401) {
        toLogin();
        return Promise.reject(error);
      }
      if (status === 403) {
        const { toast } = useToast();
        await toast({
          title: "Permission denied",
          description: "You don't have permission to access this resource",
          variant: "destructive",
        });
      }
      return Promise.reject(error);
    }
  }
);

async function setProgressBarDone() {
  const requestStore = useRequestStore();
  requestStore.decrementRequestQueueSize();
  if (requestStore.requestQueueSize > 0) {
    NProgress.inc();
  } else {
    NProgress.done();
  }
}

export default axios;
