import { ENVIRONMENT } from "@env";


// export const DEVELOPMENT = true;



export const BaseAddress = ENVIRONMENT === 'DEVELOPMENT' ? "localhost:8000" : "quickauctbackend.onrender.com";

export const Protocol = ENVIRONMENT === 'DEVELOPMENT' ? "http" : "https";

export const SocketProtocol = ENVIRONMENT === 'DEVELOPMENT' ? "ws" : "wss";
