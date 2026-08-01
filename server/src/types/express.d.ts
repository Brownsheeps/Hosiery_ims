import { users, roles } from "../../generated/prisma/client.js";

declare global {
  namespace Express {
    export interface Request {
      user?: users & { roles: roles | null };
    }
  }
}
