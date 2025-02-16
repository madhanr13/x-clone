export const baseUrl =
  process.env.NODE_ENV === "production"
    ? "" // Empty string for same-origin requests in production
    : "http://localhost:8000";
