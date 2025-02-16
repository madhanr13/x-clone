export const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://x-clone-1-1vdl.onrender.com" // Empty string for same-origin requests in production
    : "http://localhost:8000";
