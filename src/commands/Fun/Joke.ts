import Command from "../../base/classes/Command";
import axios from "axios";
import CustomClient from "../../base/classes/CustomClient";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  PermissionsBitField,
} from "discord.js";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class Joke extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "joke",
      description: `Get a random joke.`,
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
      cooldown: 5,
      dev: false,
      premium: false,
      category: Category.Fun,
      options: [],
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    await interaction.deferReply();
    try {
      let response = await axios.get(
        `${
          guild && guild.language === "fr"
            ? "https://v2.jokeapi.dev/joke/Any?lang=fr"
            : "https://v2.jokeapi.dev/joke/Any"
        }`
      );

      if (response.status === 200) {
        let jokeData = response.data;
        if (jokeData.type === "single") {
          return interaction.editReply({
            embeds: [
              {
                color: 0x6666ff,
                title: `${jokeData.joke}`,
                thumbnail: { url: this.client.user.displayAvatarURL()! },
                footer: {
                  text:
                    guild && guild.language === "fr"
                      ? `Blague #${jokeData.id} - ${jokeData.category}`
                      : `Joke ${jokeData.id} - ${jokeData.category}`,
                },
              },
            ],
          });
        } else if (jokeData.type === "twopart") {
          return interaction.editReply({
            embeds: [
              {
                color: 0x6666ff,
                title: `${jokeData.setup}`,
                description: `||${jokeData.delivery}||`,
                thumbnail: { url: this.client.user.displayAvatarURL()! },
                footer: {
                  text:
                    guild && guild.language === "fr"
                      ? `Blague #${jokeData.id} - ${jokeData.category}`
                      : `Joke ${jokeData.id} - ${jokeData.category}`,
                },
              },
            ],
          });
        } else {
          return interaction.editReply({
            embeds: [
              {
                color: 0xff6666,
                title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
                description:
                  guild && guild.language === "fr"
                    ? "Une erreur est survenue lors de la récupération de la blague. Veuillez réessayer plus tard."
                    : "An error occurred while retrieving the joke. Please try again later.",
              },
            ],
          });
        }
      } else {
        return interaction.editReply({
          embeds: [
            {
              color: 0xff6666,
              title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
              description:
                guild && guild.language === "fr"
                  ? "Une erreur est survenue lors de la récupération de la blague. Veuillez réessayer plus tard."
                  : "An error occurred while retrieving the joke. Please try again later.",
            },
          ],
        });
      }
    } catch (err) {
      return interaction.editReply({
        embeds: [
          {
            color: 0xff6666,
            title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
            description:
              guild && guild.language === "fr"
                ? "Une erreur est survenue lors de la récupération de la blague. Veuillez réessayer plus tard."
                : "An error occurred while retrieving the joke. Please try again later.",
          },
        ],
      });
    }
  }
}
