import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import CommandCounter from "../../base/schemas/CommandCounter";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class ServerInfo extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "serverinfo",
      description: "Get informations about the server",
      dm_permission: false,
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      options: [],
      cooldown: 3,
      dev: false,
      category: Category.Utilities,
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    let commandCounter = await CommandCounter.findOne({ global: 1 });
    commandCounter!.serverInfo.used += 1;
    await commandCounter?.save();

    let guild = await GuildConfig.findOne({ global: 1 });

    await interaction.deferReply();

    interaction.editReply({
      embeds: [
        {
          color: 0xff6633,
          thumbnail: { url: interaction.guild?.iconURL()! },
          description: `
          __**General**__
          `,
        },
      ],
    });
  }
}
