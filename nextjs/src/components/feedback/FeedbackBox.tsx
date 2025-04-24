"use client";
import { useState, useRef } from "react";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import useFeedbackStore from "@/stores/feedback/useFeedbackStore";
import {
  getHeadingClasses,
  getTextClasses,
  getSecondaryBgClasses,
} from "@/utils/darkModeClasses";
import LoadingSpinner from "../ui/LoadingSpinner";

const FeedbackBox = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useThemeStore();
  const { hasSubmittedFeedback, setHasSubmittedFeedback } = useFeedbackStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "YOUR_ACCESS_KEY_HERE",
          rating: `${rating} stars`,
          feedback: feedback,
          subject: "New User Feedback",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setShowThankYou(true);
        setTimeout(() => {
          setIsFadingOut(true);
        }, 4000);
        setTimeout(() => {
          setIsCollapsing(true);
        }, 5000);
        setTimeout(() => {
          setHasSubmittedFeedback(true);
        }, 6000);
        setRating(0);
        setFeedback("");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show the component if feedback has been submitted
  if (hasSubmittedFeedback) {
    return null;
  }

  return (
    <div
      ref={boxRef}
      className={`rounded-lg shadow-sm p-5 relative overflow-hidden transition-all duration-1000 ease-in-out ${
        isCollapsing
          ? "max-h-0 opacity-0 scale-y-0 origin-top mb-0"
          : "max-h-[500px] opacity-100 scale-y-100 mb-6"
      } ${getSecondaryBgClasses(isDarkMode)}`}
    >
      <div
        className={`transition-all duration-500 ease-in-out ${
          showThankYou ? "opacity-0" : "opacity-100"
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${getHeadingClasses(
            isDarkMode
          )}`}
        >
          Help Us Improve
        </h2>
        <div className="mb-4">
          <label className={`block mb-2 ${getTextClasses(isDarkMode)}`}>
            How would you rate your experience?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl focus:outline-none transition-colors duration-200 ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {rating > 0 && (
          <form onSubmit={handleSubmit} className="animate-fadeIn">
            <div className="mb-4">
              <label
                htmlFor="feedback"
                className={`block mb-2 ${getTextClasses(isDarkMode)}`}
              >
                Your thoughts
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                rows={3}
                placeholder="Share your feedback with us..."
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center min-w-[120px] ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" inline />
              ) : (
                "Submit Feedback"
              )}
            </button>
          </form>
        )}
      </div>

      <div
        className={`absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${
          showThankYou
            ? isFadingOut
              ? "opacity-0"
              : "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="text-center">
          <h2
            className={`text-xl font-semibold mb-4 ${getHeadingClasses(
              isDarkMode
            )}`}
          >
            Thank You for Your Feedback!
          </h2>
          <p className={`${getTextClasses(isDarkMode)}`}>
            Your input helps us improve our service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackBox;
