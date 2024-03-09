import axios from "axios";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  PermissionsBitField,
} from "discord.js";
import GuildConfig from "../../base/schemas/GuildConfig";
import CommandCounter from "../../base/schemas/CommandCounter";

export default class Hug extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "hug",
      description: `Show your affection by hugging someone`,
      dev: false,
      cooldown: 3,
      category: Category.Fun,
      options: [
        {
          name: "target",
          description: `The target to hug`,
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
      dm_permission: false,
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      premium: false,
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let commandCounter = await CommandCounter.findOne({ global: 1 });

    commandCounter!.hug.used += 1;
    await commandCounter?.save();

    let apiUrl = `https://nekos.life/api/v2/img/hug`;
    let target = interaction.options.getUser("target");
    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    await interaction.deferReply();
    try {
      const response = await axios.get(apiUrl);
      const gifUrl = response.data.url;

      interaction.editReply({
        content:
          guild && guild.language === "fr"
            ? `${interaction.user} a fait un calin à ${target}`
            : `${interaction.user} hugged ${target}`,
        embeds: [
          {
            image: {
              url: gifUrl,
            },
          },
        ],
      });
    } catch (err) {
      return interaction.editReply(
        guild && guild.language === "fr"
          ? "Une erreur est survenue en essayant de faire un calin."
          : `An error occured while trying to hug.`
      );
    }
  }
}
