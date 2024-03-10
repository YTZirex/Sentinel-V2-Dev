import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Modules extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "modules",
      description: `Configure the bot's modules on your server.`,
      premium: false,
      dev: false,
      default_member_permissions: PermissionsBitField.Flags.ManageGuild,
      cooldown: 5,
      dm_permission: false,
      category: Category.Administration,
      options: [
        {
          name: "list",
          description: `List all modules.`,
          type: ApplicationCommandOptionType.Subcommand,
        },
        {
          name: "economy",
          description: "Configure the economy module on your server.",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "enabled",
              description: `Enable or disable the economy module on your server.`,
              required: true,
              type: ApplicationCommandOptionType.Boolean,
            },
          ],
        },
      ],
    });
  }
}
