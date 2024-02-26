import { model, Schema } from "mongoose";

interface UserConfig {
  id: string;
  dev: boolean;
  canBlacklist: boolean;
  editPremium: boolean;
}

export default model<UserConfig>(
  "UserConfig",
  new Schema<UserConfig>({
    id: String,
    dev: Boolean,
    canBlacklist: Boolean,
    editPremium: Boolean,
  })
);
