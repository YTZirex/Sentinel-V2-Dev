import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  GuildExplicitContentFilter,
  PermissionsBitField,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";
const weather = require("weather-js");
import { Language, TranslationParameters, translate } from "deepl-client";

export default class Weather extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "weather",
      description: "Get the current weather of a location.",
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
      cooldown: 3,
      dev: false,
      premium: false,
      category: Category.Utilities,
      options: [
        {
          name: "location",
          description: "The location to get the weather of.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "units",
          description: "The units to use.",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            {
              name: "Fahrenheit",
              value: "F",
            },
            {
              name: "Celcius",
              value: "C",
            },
          ],
        },
      ],
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let loc = interaction.options.getString("location");
    let units = interaction.options.getString("units");

    let guild = await GuildConfig.findOne({ id: interaction.guildId });

    await interaction.deferReply();

    await weather.find(
      { search: `${loc}`, degreeType: `${units}` },
      async function (err: any, result: any) {
        setTimeout(async () => {
          if (err) {
            return interaction.editReply({
              embeds: [
                {
                  color: 0xff6666,
                  title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
                  description:
                    guild && guild.language === "fr"
                      ? "Une erreur est survenue. Veuillez réessayer plus tard."
                      : "An error occured. Please try again later.",
                },
              ],
            });
          } else {
            if (result.length == 0) {
              return interaction.editReply({
                embeds: [
                  {
                    color: 0xff6666,
                    title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
                    description:
                      guild && guild.language === "fr"
                        ? `Je n'ai pas pu trouver la météo de **${loc}**.`
                        : `I couldn't find the weather of **${loc}**.`,
                  },
                ],
              });
            } else {
              const temp = result[0].current.temperature;
              const type = result[0].current.skytext;
              const name = result[0].current.name;
              const feelsLike = result[0].current.feelslike;
              const icon = result[0].current.imageUrl;
              const wind = result[0].current.winddisplay;
              const day = result[0].current.day;
              const alert =
                result[0].current.alert || (guild && guild.language === "fr")
                  ? "Aucune"
                  : "None";

              return interaction.editReply({
                embeds: [
                  {
                    color: 0x6666ff,
                    title:
                      guild && guild.language === "fr"
                        ? `Météo de **${loc}**`
                        : `Weather of **${loc}**`,
                    thumbnail: {
                      url: icon,
                    },
                    fields: [
                      {
                        name:
                          guild && guild.language === "fr"
                            ? "Température"
                            : "Temperature",
                        value: units === "C" ? `${temp}°C` : `${temp}°F`,
                      },
                      {
                        name:
                          guild && guild.language === "fr"
                            ? "Ressenti"
                            : "Feels Like",
                        value:
                          units === "C" ? `${feelsLike}°C` : `${feelsLike}°F`,
                      },
                      {
                        name:
                          guild && guild.language === "fr"
                            ? "Météo"
                            : "Weather",
                        value:
                          guild && guild.language === "fr"
                            ? `${await (
                                await translate({
                                  auth_key:
                                    "01be6c49-b75d-4c6f-b0e7-1cb6c8ddc8bd:fx",
                                  target_lang: Language.French,
                                  text: type,
                                })
                              ).translations[0].text}`
                            : `${type}`,
                      },
                      {
                        name:
                          guild && guild.language === "fr"
                            ? "Alertes Actuelles"
                            : "Current Alerts",
                        value:
                          guild && guild.language === "fr"
                            ? `${
                                alert === "Aucune"
                                  ? "Aucune"
                                  : await (
                                      await translate({
                                        auth_key:
                                          "01be6c49-b75d-4c6f-b0e7-1cb6c8ddc8bd:fx",
                                        target_lang: Language.French,
                                        text: alert,
                                      })
                                    ).translations[0].text
                              }`
                            : `${alert}`,
                      },
                      {
                        name:
                          guild && guild.language === "fr"
                            ? "Jour De La Semaine"
                            : "Week Day",
                        value:
                          guild && guild.language === "fr"
                            ? `${await (
                                await translate({
                                  auth_key:
                                    "01be6c49-b75d-4c6f-b0e7-1cb6c8ddc8bd:fx",
                                  target_lang: Language.French,
                                  text: day,
                                })
                              ).translations[0].text}`
                            : `${day}`,
                      },
                      {
                        name:
                          guild && guild.language === "fr"
                            ? "Vitesse & Direction Du Vent"
                            : "Wind Speed & Direction",
                        value:
                          guild && guild.language === "fr"
                            ? `${await (
                                await translate({
                                  auth_key:
                                    "01be6c49-b75d-4c6f-b0e7-1cb6c8ddc8bd:fx",
                                  target_lang: Language.French,
                                  text: wind,
                                })
                              ).translations[0].text}`
                            : `${wind}`,
                      },
                    ],
                  },
                ],
              });
            }
          }
        });
      }
    );
  }
}
