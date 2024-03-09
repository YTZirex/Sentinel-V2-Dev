import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";
import GuildProtection from "../../base/schemas/GuildProtection";
import CommandCounter from "../../base/schemas/CommandCounter";

export default class ProtectionBlacklist extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "protection.blacklist",
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {

    let commandCounter = await CommandCounter.findOne({ global: 1 });

    commandCounter!.protection.blacklist.used += 1;
    await commandCounter?.save();

    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    let guildProtection = await GuildProtection.findOne({
      id: interaction.guildId,
    });

    if (!guildProtection)
      guildProtection = await GuildProtection.create({
        id: interaction.guildId,
      });

    let enabled = interaction.options.getBoolean("enabled")!;
    await interaction.deferReply();

    try {
      guildProtection.protection.blacklist.enabled = enabled;
      await guildProtection.save();
      return interaction.editReply({
        embeds: [
          {
            color: enabled === true ? 0x33cc99 : 0xff6666,
            title: guild && guild.language === "fr" ? `Succès!` : "Success!",
            description:
              guild && guild.language === "fr"
                ? `La blacklist est maintenant ${
                    enabled === true ? `**activée**` : "**désactivée**"
                  } sur votre serveur.`
                : `The blacklist is now ${
                    enabled === true ? `**enabled**` : `**disabled**`
                  } on your server.`,
          },
        ],
      });
    } catch (err) {
      return interaction.editReply({
        embeds: [
          {
            color: 0xff6666,
            title: guild && guild.language === "fr" ? `Oups!` : "Oops!",
            description:
              guild && guild.language === "fr"
                ? `Une erreur est survenue lors de la mise à jour des protections. Veuillez réessayer.\nSi cela persiste, merci de faire une demande de protection sur notre Support.`
                : `An error occured while updating your protections. Please try again.\nIf this persists, please ask for a manual protection on our Support.`,
          },
        ],
      });
    }
  }
}
