export const DEVELOPMENT = true;

export const BaseAddress = DEVELOPMENT
  ? "localhost:8000"
  : "quickauctbackend.onrender.com";

export const Protocol = DEVELOPMENT ? "http" : "https";
