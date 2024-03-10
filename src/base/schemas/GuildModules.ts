import { Schema, model } from "mongoose";

interface IGuildModules {
  id: string;
  economy: {
    enabled: boolean;
  };
  join: {
    enabled: boolean;
  };
  leave: {
    enabled: boolean;
  };
  level: {
    enabled: boolean;
  };
}

export default model<IGuildModules>(
  "GuildModules",
  new Schema<IGuildModules>({
    id: String,
    economy: {
      enabled: Boolean,
    },
    join: {
      enabled: Boolean,
    },
    leave: {
      enabled: Boolean,
    },
    level: {
      enabled: Boolean,
    },
  })
);
