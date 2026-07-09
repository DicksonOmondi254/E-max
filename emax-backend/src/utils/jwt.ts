import jwt, { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES || "7d") as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};