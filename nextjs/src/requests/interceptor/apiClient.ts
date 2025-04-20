import axios from "axios";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useRouter } from "next/router";

// Create axios instance
const apiClient = axios.create({
  baseURL: "https://ny2wtm2guh.execute-api.eu-north-1.amazonaws.com/",
});

let isRefreshing = false; // Flag to track if refresh token is in progress

interface Request {
  resolve: (value: string) => void;
  reject: (reason: unknown) => void;
}

let failedQueue: Request[] = []; // Queue to store requests that need to be retried

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((request: Request) => {
    if (token) {
      request.resolve(token); // Resolve requests with the new token
    } else {
      if (error instanceof Error) {
        request.reject(error); // Reject requests if refresh failed
      } else {
        request.reject(new Error("Unknown error")); // Handle non-Error types
      }
    }
  });

  failedQueue = []; // Clear the failed queue
};

// Add response interceptor
apiClient.interceptors.response.use(
  function (response) {
    // Any status code that lies within the range of 2xx cause this function to trigger
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    // If the error status is 401 and there's no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call the refresh token endpoint
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/user/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        const newTokenData = response.data;

        // Update the token in the store
        const { setTokenData } = useAuthStore.getState();
        setTokenData(newTokenData);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newTokenData.access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, log the user out
        const { setTokenData } = useAuthStore.getState();
        setTokenData(null);
        const router = useRouter();
        router.push("/");
        return Promise.reject(refreshError);
      }
    }

    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);

export default apiClient;
