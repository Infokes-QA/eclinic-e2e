import { ENV } from "../config/env";
import { UserCredential } from "../types/user.type";

export const Users: Record<string, UserCredential> = {
  admin: {
    clinic: ENV.CLINIC_NAME,
    username: ENV.USERNAME,
    password: ENV.PASSWORD,
  },
};
 