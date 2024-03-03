import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import CommandCounter from "../../base/schemas/CommandCounter";
import GuildConfig from "../../base/schemas/GuildConfig";
import GuildProtection from "../../base/schemas/GuildProtection";

export default class ServerInfo extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "serverinfo",
      premium: false,
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

    interaction.reply({
      content: "Command not made yet.",
      ephemeral: true,
    });

    let guildFetched = await interaction.guild?.fetch();

    let guild = await GuildConfig.findOne({
      id: interaction.guildId
    });

    let guildProtection = await GuildProtection.findOne({
      id: interaction.guildId,
    })

    return interaction.reply({
      content: `This command was not made yet.`,
      ephemeral: true
    })

  }
}
