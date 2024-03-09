import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";
import GuildProtection from "../../base/schemas/GuildProtection";
import CommandCounter from "../../base/schemas/CommandCounter";

export default class ProtectionDelete extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "protection.delete",
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {

    let commandCounter = await CommandCounter.findOne({ global: 1 });

    commandCounter!.protection.delete.used += 1;
    await commandCounter?.save();

    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    let guildProtection = await GuildProtection.findOne({
      id: interaction.guildId,
    });

    await interaction.deferReply();

    if (!guildProtection) {
      return interaction.editReply({
        embeds: [
          {
            color: 0xff6666,
            title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
            description:
              guild && guild.language === "fr"
                ? `Ce server n'a aucune protection de Sentinel.`
                : `This server does not have any protection from Sentinel.`,
            thumbnail: { url: interaction.guild?.iconURL()! },
          },
        ],
      });
    }
    await GuildProtection.deleteOne({ id: interaction.guildId });
    return interaction.editReply({
      embeds: [
        {
          color: 0x33cc99,
          title: guild && guild.language === "fr" ? `Succès!` : "Success!",
          thumbnail: { url: interaction.guild?.iconURL()! },
          description:
            guild && guild.language === "fr"
              ? `Les protections de Sentinel sur ce serveur a été supprimée avec succès.`
              : `Sentinel's protections on this server have been deleted successfully.`,
        },
      ],
    });
  }
}
