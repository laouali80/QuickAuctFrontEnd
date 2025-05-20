export const DEVELOPMENT = false;

export const BaseAddress = DEVELOPMENT
  ? "localhost:8000"
  : "quick-auct-backend.vercel.app";

export const Protocol = DEVELOPMENT ? "http" : "https";
