import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildModules from "../../base/schemas/GuildModules";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class ModulesList extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "modules.list",
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let guildModules = await GuildModules.findOne({ id: interaction.guildId });
    let guild = await GuildConfig.findOne({ id: interaction.guildId });

    await interaction.deferReply();

    if (guildModules) {
      return interaction.editReply({
        embeds: [
          {
            color: 0x6666ff,
            title: "Modules",
            thumbnail: {
              url:
                interaction.guild?.iconURL() ||
                this.client.user.displayAvatarURL(),
            },
            fields: [
              {
                name: guild && guild.language === "fr" ? "Economie" : "Economy",
                value:
                  guildModules && guildModules.economy.enabled === true
                    ? "✅"
                    : "❌",
              },
            ],
          },
        ],
      });
    } else {
      return interaction.editReply({
        embeds: [
          {
            color: 0x6666ff,
            title: "Modules",
            thumbnail: {
              url:
                interaction.guild?.iconURL() ||
                this.client.user.displayAvatarURL(),
            },
            fields: [
              {
                name: guild && guild.language === "fr" ? "Economie" : "Economy",
                value: "✅",
              },
            ],
          },
        ],
      });
    }
  }
}
