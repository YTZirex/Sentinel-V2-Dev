import { Schema, model } from "mongoose";

interface GuildProtection {
  id: string;
  protection: {
    messages: {
      invites: boolean;
      links: boolean;
    };
    antispam: {
      messages: number;
    };
    mentions: {
      max: {
        enabled: boolean;
        limit: number;
      };
      users: Array<string>;
    };
    blacklist: {
      enabled: boolean;
    };
  };
}

export default model<GuildProtection>(
  "GuildProtection",
  new Schema<GuildProtection>(
    {
      id: String,
      protection: {
        messages: {
          invites: Boolean,
          links: Boolean,
        },
        antispam: {
          messages: Number,
        },
        mentions: {
          max: {
            enabled: Boolean,
            limit: Number,
          },
          users: Array<string>,
        },
        blacklist: {
          enabled: Boolean,
        },
      },
    },
    {
      timestamps: true,
    }
  )
);
