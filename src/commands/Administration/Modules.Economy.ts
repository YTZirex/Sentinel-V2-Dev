import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";
import GuildModules from "../../base/schemas/GuildModules";

export default class ModulesEconomy extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "modules.economy",
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let enabled = interaction.options.getBoolean("enabled") || false;

    await interaction.deferReply();

    let guild = await GuildConfig.findOne({
      id: interaction.guildId,
    });

    let guildModules = await GuildModules.findOne({
      id: interaction.guildId,
    });

    if (!guildModules) {
      guildModules = await GuildModules.create({ id: interaction.guildId });
    }

    if (guildModules.economy.enabled === enabled) {
      return interaction.editReply({
        embeds: [
          {
            description:
              guild && guild.language === "fr"
                ? `Le module **Economie** est déjà ${
                    enabled ? "activé" : "désactivé"
                  }.`
                : `The **Economy** module is already ${
                    enabled ? "enabled" : "disabled"
                  }.`,
            title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
            color: 0xff6666,
            thumbnail: {
              url: this.client.user.displayAvatarURL(),
            },
          },
        ],
      });
    }

    try {
      guildModules.economy.enabled = enabled;
      await guildModules.save().then(() => {
        return interaction.editReply({
          embeds: [
            {
              thumbnail: { url: this.client.user.displayAvatarURL() },
              title: guild && guild.language === "fr" ? "Succès!" : "Success!",
              color: 0x33cc99,
              description:
                guild && guild.language === "fr"
                  ? `✅ Le module **Economie** est maintenant ${
                      enabled ? "activé" : "désactivé"
                    }.`
                  : `✅ The **Economy** module is now ${
                      enabled ? "enabled" : "disabled"
                    }.`,
            },
          ],
        });
      });
    } catch (err) {
      return interaction.editReply({
        embeds: [
          {
            thumbnail: { url: this.client.user.displayAvatarURL() },
            title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
            color: 0xff6666,
            description:
              guild && guild.language === "fr"
                ? `Une erreur est survenue lors de la mise à jour du module. Veuillez réessayer.`
                : `An error occured while updating the module. Please try again.`,
          },
        ],
      });
    }
  }
}
