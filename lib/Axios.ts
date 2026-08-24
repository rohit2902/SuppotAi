import axios from "axios";

// Shared axios instance for the whole app.
// withCredentials: true is REQUIRED so the browser sends/receives
// the auth cookie set by your login/register API routes.
const api = axios.create({
  baseURL: "/", // same-origin Next.js API routes
  withCredentials: true,
});

export default api;