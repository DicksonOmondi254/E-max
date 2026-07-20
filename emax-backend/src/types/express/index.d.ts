import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      email: string;
      role: Role;

      firstName?: string;
      lastName?: string;

      iat?: number;
      exp?: number;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};