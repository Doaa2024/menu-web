// Base URL for the Laravel backend.
// In production set VITE_API_URL (e.g. on Render) to the deployed API origin,
// e.g. https://menu-backend.onrender.com — no trailing slash, no /api suffix.
// Falls back to the local dev server when the env var is absent.
export const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
