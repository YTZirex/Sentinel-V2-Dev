import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Protection extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "protection",
      description: `Manage the protection of your guild.`,
      dev: false,
      cooldown: 5,
      category: Category.Administration,
      options: [
        {
          name: "messages",
          description: `Manage the monitoring of your guild messages.`,
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "invites",
              description: `Deletes messages containing invites.`,
              required: true,
              type: ApplicationCommandOptionType.Boolean,
            },
            {
              name: "links",
              description: `Deletes messages containing links.`,
              required: true,
              type: ApplicationCommandOptionType.Boolean,
            },
          ],
        },
        {
          name: "delete",
          description: `Delete all Sentinel's protections on your server.`,
          type: ApplicationCommandOptionType.Subcommand,
        },
        {
          name: "mentions",
          description: `Manage the limit of mentions in a message and who you cannot mention.`,
          options: [
            {
              name: "limit",
              description: `The limit of mentions in a message.`,
              required: true,
              type: ApplicationCommandOptionType.Integer,
            },
          ],
          type: ApplicationCommandOptionType.Subcommand,
        },
        {
          name: "blacklist",
          description: `Prevents Sentinel's blacklisted users from joining your server.`,
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "enabled",
              description: `Enable or disables the blacklist.`,
              required: true,
              type: ApplicationCommandOptionType.Boolean,
            },
          ],
        },
        {
            name: 'scan',
            description: `Scans your server for blacklisted users.`,
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'kick',
                    description: `Kick all blacklisted users found.`,
                    required: true,
                    type: ApplicationCommandOptionType.Boolean,
                }
            ]
        }
      ],
      dm_permission: false,
      default_member_permissions: PermissionsBitField.Flags.ManageGuild,
      premium: false,
    });
  }
}
