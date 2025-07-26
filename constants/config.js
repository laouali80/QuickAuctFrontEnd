import { ENVIRONMENT, Private_URL, Public_URL } from "@env";

// export const DEVELOPMENT = true;

// console.log("Private URL: ", typeof Private_URL);
// console.log("Public URL: ", typeof Public_URL);

export const BaseAddress =
  ENVIRONMENT === "DEVELOPMENT" ? Public_URL : Private_URL;

export const Protocol = ENVIRONMENT === "DEVELOPMENT" ? "http" : "https";

export const SocketProtocol = ENVIRONMENT === "DEVELOPMENT" ? "ws" : "wss";
