import axios from "axios";
import { useAuthStore } from "@/stores/auth/useAuthStore";

// Create axios instance
const apiClient = axios.create({
  baseURL: "https://ny2wtm2guh.execute-api.eu-north-1.amazonaws.com/",
});

let isRefreshing = false; // Flag to track if refresh token is in progress
let failedQueue: any[] = []; // Queue to store requests that need to be retried

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((request: any) => {
    if (token) {
      request.resolve(token); // Resolve requests with the new token
    } else {
      request.reject(error); // Reject requests if refresh failed
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
    // Handle refreshing token if error is 401
    if (error.response?.status === 401) {
      console.log("Interceptor activated on 401 error");

      // Get refresh token from the store
      const { setTokenData } = useAuthStore.getState();

      if (!isRefreshing) {
        // Check if we're not already refreshing the token
        isRefreshing = true;
        try {
          // Make a call to the refresh token route
          console.log("Calling refresh token route");

          let newTokenData;

          try {
            const response = await axios.post(
              "https://ny2wtm2guh.execute-api.eu-north-1.amazonaws.com/user/refreshToken", // Backend refresh token route
              {}, // Request body (empty in this case)
              { withCredentials: true }
            );
            newTokenData = response.data.data;
            console.log("New token data: ", newTokenData);
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            // Logout and redirect to home if refresh fails
            const logout = useAuthStore.getState().logout;
            logout(); // This will handle logging out the user

            console.log("User logged out");

            return Promise.reject("Failed to refresh token. User logged out.");
          }

          console.log("New token data: ", newTokenData);

          // Preserve the previous refresh token if it exists
          const updatedTokenData = {
            access_token: newTokenData.accessToken as string,
          };

          // Update the token data in the store and wait for it to complete
          await new Promise<void>((resolve) => {
            setTokenData(updatedTokenData); // Update state
            resolve(); // Resolve the promise to proceed with the next logic
          });

          // Retry the original request with the new access token
          console.log(
            "Retrying with new access token:",
            newTokenData.accessToken
          );
          error.config.headers[
            "Authorization"
          ] = `Bearer ${newTokenData.accessToken}`;
          console.log("Request headers before retry:", error.config.headers);

          processQueue(null, newTokenData.accessToken);

          return axios(error.config);
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);

          // Call the logout function from your auth store
          const logout = useAuthStore.getState().logout;
          logout(); // This will handle logging out the use

          console.log("User logged out");

          // Reject all failed requests
          processQueue(refreshError, null);

          // Stop the flow and reject the error
          return Promise.reject(
            "Refresh token is invalid, user logged out and data cleared"
          );
        } finally {
          isRefreshing = false; // Reset the flag once the refresh process is complete
        }
      }
      // If there's no refresh token or refresh is already in progress, reject the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              error.config.headers["Authorization"] = `Bearer ${token}`;
              resolve(axios(error.config));
            },
            reject: (err: any) => reject(err),
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
