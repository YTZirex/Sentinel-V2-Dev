import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";
import GuildProtection from "../../base/schemas/GuildProtection";
import CommandCounter from "../../base/schemas/CommandCounter";

export default class ProtectionMessages extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "protection.messages",
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {

    let commandCounter = await CommandCounter.findOne({ global: 1 });

    commandCounter!.protection.messages.used += 1;
    await commandCounter?.save();

    let blockLinks = interaction.options.getBoolean("links")!;
    let blockInvites = interaction.options.getBoolean("invites")!;

    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    let guildProtection = await GuildProtection.findOne({
      id: interaction.guildId,
    });

    await interaction.deferReply();

    if (!guildProtection)
      guildProtection = await GuildProtection.create({
        id: interaction.guildId,
      });

    try {
      guildProtection.protection.messages.invites = blockInvites;
      guildProtection.protection.messages.links = blockLinks;
      await guildProtection.save();
      return interaction.editReply({
        embeds: [
          {
            color: 0x33cc99,
            title: guild && guild.language === "fr" ? `Succès!` : "Success!",
            description:
              guild && guild.language === "fr"
                ? "Vos protections ont été mises à jours.\nSi l'utilisateur possède la permission `MANAGE_MESSAGES`, il ne sera pas soumit à la protection."
                : `Your protections have been updated.\nIf the user has the permission \`MANAGE_MESSAGES\`, he will not be subject to the protection.`,
            fields: [
              {
                name:
                  guild && guild.language === "fr"
                    ? `Supression d'invitations:`
                    : `Removal of invites: `,
                value:
                  guildProtection.protection.messages.invites === true
                    ? "✅"
                    : "❌",
              },
              {
                name:
                  guild && guild.language === "fr"
                    ? `Suppresion des liens`
                    : `Removal of links`,
                value:
                  guildProtection.protection.messages.links === true
                    ? "✅"
                    : "❌",
              },
            ],
          },
        ],
      });
    } catch (err) {
      return interaction.editReply({
        embeds: [
          {
            color: 0xff6666,
            title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
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
