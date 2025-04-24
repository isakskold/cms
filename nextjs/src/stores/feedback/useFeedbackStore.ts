import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FeedbackState {
  hasSubmittedFeedback: boolean;
  setHasSubmittedFeedback: (value: boolean) => void;
}

const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set) => ({
      hasSubmittedFeedback: false,
      setHasSubmittedFeedback: (value) => set({ hasSubmittedFeedback: value }),
    }),
    {
      name: "feedback-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useFeedbackStore;
