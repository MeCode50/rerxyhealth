import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      admin?: {
        email: string;
        role: string;
      };
      user?: { id: string };
    }
  }
}
