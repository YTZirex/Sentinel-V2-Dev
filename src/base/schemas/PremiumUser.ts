import { Schema, model } from "mongoose";

interface PremiumUser {
  code: string;
  length: string;
  redeemedBy: {
    id: string;
    username: string;
  };
  redeemedOn: Date;
  expiresAt: Date;
}

export default model<PremiumUser>(
  "PremiumUser",
  new Schema<PremiumUser>({
    code: String,
    length: String,
    redeemedBy: {
      id: String,
      username: String,
    },
    redeemedOn: Date,
    expiresAt: Date,
  })
);
