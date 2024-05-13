import { defineStore } from "pinia";

export const useRequestStore = defineStore({
  id: "request",
  state: () => ({
    requestQueueSize: 0,
  }),

  actions: {
    incrementRequestQueueSize() {
      this.requestQueueSize++;
    },
    decrementRequestQueueSize() {
      this.requestQueueSize--;
    },
  },
});
