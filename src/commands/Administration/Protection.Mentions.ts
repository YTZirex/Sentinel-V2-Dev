import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";
import GuildProtection from "../../base/schemas/GuildProtection";

export default class ProtectionMentions extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "protection.mentions",
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    let guildProtection = await GuildProtection.findOne({
      id: interaction.guildId,
    });

    let mentionsLimit = interaction.options.getInteger("limit")!;

    await interaction.deferReply();

    if (!guildProtection)
      guildProtection = await GuildProtection.create({
        id: interaction.guildId,
      });

    if (mentionsLimit < 0 || mentionsLimit > 99)
      return interaction.editReply({
        embeds: [
          {
            color: 0xff6666,
            title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
            description:
              guild && guild.language === "fr"
                ? `La limite doit être entre **0** et **99** mentions par messages.`
                : `The limit must be between **0** and **99** mentions per messages.`,
            thumbnail: { url: interaction.guild?.iconURL()! },
          },
        ],
      });
    try {
      guildProtection.protection.mentions.max.enabled = true;
      guildProtection.protection.mentions.max.limit = mentionsLimit;
      await guildProtection.save();
      return interaction.editReply({
        embeds: [
          {
            color: 0x33cc99,
            title: guild && guild.language === "fr" ? "Succès!" : "Success!",
            description:
              guild && guild.language === "fr"
                ? `La protection a été mise à **${guildProtection.protection.mentions.max.limit} mentions par message**.`
                : `The protection has been set to **${guildProtection.protection.mentions.max.limit} mentions per message**.`,
            thumbnail: { url: interaction.guild?.iconURL()! },
          },
        ],
      });
    } catch (err) {
      return interaction.editReply({
        embeds: [
          {
            color: 0xff6666,
            title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
            thumbnail: { url: interaction.guild?.iconURL()! },
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
