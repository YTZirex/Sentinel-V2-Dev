import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";
import CommandCounter from "../../base/schemas/CommandCounter";

export default class Select extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "help",
      premium: false,
      description: "Lists all available commands.",
      dm_permission: false,
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      cooldown: 3,
      dev: false,
      options: [],
      category: Category.Utilities,
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    let interactionUserId = interaction.user.id;

    let commandCounter = await CommandCounter.findOne({ global: 1 });
    commandCounter!.help.used += 1;
    await commandCounter?.save();

    let guild = await GuildConfig.findOne({
      id: interaction.guildId,
    });
    if (guild && guild.language) {
      interaction.editReply({
        embeds: [
          {
            title:
              guild.language === "fr"
                ? "Veuillez sélectionner une catégorie de commandes."
                : "Please select a commands category.",
            color: 0x6666ff,
          },
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 3,
                custom_id: "help_select",
                options: [
                  {
                    label:
                      guild.language === "fr" ? "Utilitaires" : "Utilities",
                    value: "utilities",
                    emoji: {
                      name: "🛠️",
                    },
                    //description: "",
                  },
                  {
                    label: "Fun",
                    value: "fun",
                    emoji: {
                      name: "🎉",
                    },
                  },
                  {
                    label: guild.language === "fr" ? "Jeux" : "Games",
                    value: "games",
                    emoji: {
                      name: "🎮",
                    },
                  },
                  {
                    label: guild.language === "fr" ? "Economie" : "Economy",
                    value: "economy",
                    emoji: {
                      name: "💸",
                    },
                  },
                  {
                    label:
                      guild.language === "fr" ? "Modération" : "Moderation",
                    value: "moderation",
                    emoji: {
                      name: "🛡️",
                    },
                    // description: "bibouuu",
                  },
                  {
                    label: "Administration",
                    value: "administration",
                    emoji: {
                      name: "🔐",
                    },
                  },
                ],
                placeholder:
                  guild.language === "fr"
                    ? "Choisissez une catégorie"
                    : "Pick a category",
                min_values: 1,
                max_values: 1,
              },
            ],
          },
        ],
      });
    } else {
      interaction.editReply({
        embeds: [
          {
            title: "Please select a commands category.",
            color: 0x6666ff,
          },
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 3,
                custom_id: "help_select",
                options: [
                  {
                    label: "Utilities",
                    value: "utilities",
                    emoji: {
                      name: "🛠️",
                    },
                    //description: "",
                  },
                  {
                    label: "Fun",
                    value: "fun",
                    emoji: {
                      name: "🎉",
                    },
                  },
                  {
                    label: "Games",
                    value: "games",
                    emoji: {
                      name: "🎮",
                    },
                  },
                  {
                    label: "Economy",
                    value: "economy",
                    emoji: {
                      name: "💸",
                    },
                  },
                  {
                    label: "Moderation",
                    value: "moderation",
                    emoji: {
                      name: "🛡️",
                    },
                    // description: "bibouuu",
                  },
                  {
                    label: "Administration",
                    value: "administration",
                    emoji: {
                      name: "🔐",
                    },
                  },
                ],
                placeholder: "Pick a category",
                min_values: 1,
                max_values: 1,
              },
            ],
          },
        ],
      });
    }

    this.client.on("interactionCreate", async (interaction) => {
      if (interaction.isStringSelectMenu()) {
        if (interaction.customId === "help_select") {
          const [choices] = interaction.values;
          if (guild && guild.language) {
            if (choices === "utilities") {
              interaction.update({
                embeds: [
                  {
                    title:
                      guild.language === "fr"
                        ? "🛠️ Utilitaires"
                        : "🛠️ Utilities",
                    color: 0x6666ff,
                    thumbnail: {
                      url: this.client.user!.displayAvatarURL(),
                    },
                    fields: [
                      {
                        name: "</help:1205979101765173258>",
                        value:
                          guild.language === "fr"
                            ? "Donne des informations sur une catégorie de commandes."
                            : `Provides informations about a category of commands.`,
                      },
                      {
                        name: "</botinfo:1204396655840075788>",
                        value:
                          guild.language === "fr"
                            ? "Donne des informations sur le bot."
                            : `Provides informations about the bot.`,
                      },
                      {
                        name: "</profile:1204177049275732019>",
                        value:
                          guild.language === "fr"
                            ? "Donne le profile de l'utilisateur sélectionné."
                            : `Provides the profile of the user selected.`,
                      },
                      {
                        name: "</userinfo:1204183882149138472>",
                        value:
                          guild.language === "fr"
                            ? "Donne des informations à propos de l'utilisateur sélectionné."
                            : `Provides informations about the user selected.`,
                      },
                      {
                        name: "</serverinfo:1204396655840075787>",
                        value:
                          guild.language === "fr"
                            ? "Donne des informations à propos du serveur."
                            : `Provides informations about the server.`,
                      },
                      {
                        name: "</ping:1209939749746249769>",
                        value:
                          guild.language === "fr"
                            ? `Donne la latence du bot.`
                            : `Shows the bot's latency.`,
                      },
                      {
                        name: "</avatar:1209939749746249770>",
                        value:
                          guild.language === "fr"
                            ? `Montre l'avatar d'un utilisateur`
                            : `Shows a user's avatar.`,
                      },
                      {
                        name: "</quote:1214343869567729666>",
                        value:
                          guild.language === "fr"
                            ? "Génère une citation aléatoire."
                            : "Get a random quote.",
                      },
                      {
                        name: "</weather:1215034912621600798>",
                        value:
                          guild.language === "fr"
                            ? "Obtenez la météo actuelle d’un lieu."
                            : "Get the current weather of a location.",
                      },
                    ],
                  },
                ],
              });
            } else if (choices === "fun") {
              interaction.update({
                embeds: [
                  {
                    color: 0x6666ff,
                    title: "🎉 Fun",
                    thumbnail: { url: this.client.user!.displayAvatarURL() },
                    fields: [
                      {
                        name: "</magicball:1207786679742631967>",
                        value:
                          guild.language === "fr"
                            ? "Permet de poser une question à la boule magique."
                            : `Ask a question to the magic ball.`,
                      },
                      {
                        name: "</kiss:1211782590743187526>",
                        value:
                          guild.language === "fr"
                            ? "Montrez votre affection en embrassant quelqu’un <3"
                            : `Show your affection by kissing someone <3`,
                      },
                      {
                        name: "</hug:1211782590743187527>",
                        value:
                          guild.language === "fr"
                            ? "Montrez votre affection en serrant quelqu’un dans vos bras <3"
                            : `Show your affection by hugging someone <3`,
                      },
                      {
                        name: "</joke:1213921432266874911>",
                        value:
                          guild.language === "fr"
                            ? `Donne une blague aléatoire.`
                            : `Get a random joke.`,
                      },
                    ],
                  },
                ],
              });
            } else if (choices === "games") {
              interaction.update({
                embeds: [
                  {
                    title: guild.language === "fr" ? "🎮 Jeux" : "🎮 Games",
                    color: 0x6666ff,
                    thumbnail: {
                      url: this.client.user!.displayAvatarURL(),
                    },
                    fields: [
                      {
                        name: "</games tictactoe:1214304049063661598>",
                        value:
                          guild.language === "fr"
                            ? `Jouez au morpion avec une IA ou un adversaire.`
                            : `Play a game of tic tac toe with an AI or an opponent.`,
                      },
                      {
                        name: "</games 2048:1214304049063661598>",
                        value:
                          guild.language === "fr"
                            ? "Jouez au 2048."
                            : `Play a game of 2048.`,
                      },
                      {
                        name: "</games rpc:1214304049063661598>",
                        value:
                          guild.language === "fr"
                            ? "Jouez à Pierre Feuille Ciseaux avec un adversaire."
                            : `Play a game of Rock Paper Scissors with an opponent.`,
                      },
                      {
                        name: "</games snake:1214304049063661598>",
                        value:
                          guild.language === "fr"
                            ? `Jouez au snake.`
                            : `Play a game of snake.`,
                      },
                      {
                        name: "</games slots:1214304049063661598>",
                        value:
                          guild.language === "fr"
                            ? `Jouez à la machine à sous.`
                            : `Play a game of slots`,
                      },
                    ],
                  },
                ],
              });
            } else if (choices === "economy") {
              interaction.update({
                embeds: [
                  {
                    title:
                      guild.language === "fr?" ? "💸 Economie" : "💸 Economy",
                    color: 0x6666ff,
                    thumbnail: {
                      url: this.client.user!.displayAvatarURL(),
                    },
                    fields: [
                      {
                        name: "</account create:1204810971416236072>",
                        value:
                          guild.language === "fr"
                            ? "Créer un nouveau compte bancaire."
                            : "Creates a new bank account.",
                      },
                      {
                        name: "</account delete:1204810971416236072>",
                        value:
                          guild.language === "fr"
                            ? "Supprime votre compte bancaire. Nous ne pouvons pas annuler cette action."
                            : `Deletes your bank account. We can't undo this action.`,
                      },
                      {
                        name: "</account informations:1204810971416236072>",
                        value:
                          guild.language === "fr"
                            ? `Donne des informations à propos de votre compte bancaire.`
                            : `Get informations about your bank account.`,
                      },
                      {
                        name: "</job list:1205982914131791973>",
                        value:
                          guild.language === "fr"
                            ? `Permet de voir la liste des métiers disponibles.`
                            : `Allows you to see the list of all available jobs.`,
                      },
                      {
                        name: "</job change:1205982914131791973>",
                        value:
                          guild.language === "fr"
                            ? "Vous permet de changer d'emploi."
                            : `Allows you to change your job.`,
                      },
                      {
                        name: "</job informations:1205982914131791973>",
                        value:
                          guild.language === "fr"
                            ? "Donne des informations à propos de votre emploi actuel."
                            : `Provides informations about your current job.`,
                      },
                      {
                        name: "</work:1209577162487631872>",
                        value:
                          guild.language === "fr"
                            ? "Vous permet de travailler."
                            : "Allows you to work.",
                      },
                    ],
                  },
                ],
              });
            } else if (choices === "moderation") {
              interaction.update({
                embeds: [
                  {
                    title:
                      guild.language === "fr"
                        ? "🛡️ Modération"
                        : "🛡️ Moderation",
                    color: 0x6666ff,
                    thumbnail: {
                      url: this.client.user!.displayAvatarURL(),
                    },
                    fields: [
                      {
                        name: "</timeout add:1203786292404682752>",
                        value:
                          guild.language === "fr"
                            ? "Ajoute un timeout à l'utilisateur sélectionné."
                            : `Adds a timeout to the user selected.`,
                      },
                      {
                        name: "</timeout remove:1203786292404682752>",
                        value:
                          guild.language === "fr"
                            ? "Enlève un timeout à l'utilisateur sélectionné."
                            : `Removes a timeout from the user selected.`,
                      },
                      {
                        name: "</ban add:1203429758977839174>",
                        value:
                          guild.language === "fr"
                            ? "Banni l'utilisateur sélectionné du serveur."
                            : "Bans the selected user from the server.",
                      },
                      {
                        name: "</ban remove:1203429758977839174>",
                        value:
                          guild.language === "fr"
                            ? "Enlève le banissement d'un utilisateur sélectionné."
                            : "Unbans the selected user from the server.",
                      },
                      {
                        name: "</kick:1203779567886536714>",
                        value:
                          guild.language === "fr"
                            ? "Expulse l'utilisateur sélectionné du serveur."
                            : "Kicks the selected user from the server.",
                      },
                      {
                        name: "</clear:1204118823075188806>",
                        value:
                          guild.language === "fr"
                            ? "Supprime un nombre de messages sélectionnés dans un salon."
                            : "Clears a selected amount of messages in a channel.",
                      },
                    ],
                  },
                ],
              });
            } else if (choices === "administration") {
              interaction.update({
                embeds: [
                  {
                    title: "🔐 Administration",
                    color: 0x6666ff,
                    thumbnail: {
                      url: this.client.user!.displayAvatarURL(),
                    },
                    fields: [
                      {
                        name: "</protection scan:1213599917524779069>",
                        value:
                          guild.language === "fr"
                            ? `Scan le serveur pour trouver des utilisateurs blacklist.`
                            : `Scans the server to find blacklisted users.`,
                      },
                      {
                        name: "</protection mentions:1213599917524779069>",
                        value:
                          guild.language === "fr"
                            ? `Met une limite de mentions par messages.`
                            : `Set a limit for mentions in a message.`,
                      },
                      {
                        name: "</protection messages:1213599917524779069>",
                        value:
                          guild.language === "fr"
                            ? `Supprime les messages contenant une invitation ou un lien si l'utilisateur n'a pas la permission \`Gérer les messages\`.`
                            : `Deletes message including a link or an invite if the user does not have the \`Manage Messages\` permission.`,
                      },
                      {
                        name: "</protection blacklist:1213599917524779069>",
                        value:
                          guild.language === "fr"
                            ? `Empêche les utilisateurs blacklist de rejoindre le serveur.`
                            : `Prevents blacklisted users from joining the server.`,
                      },
                      {
                        name: "</announcement:1206014845267480618>",
                        value:
                          guild.language === "fr"
                            ? "Permet de créer une annonce."
                            : `Allows you to create an announcement.`,
                      },
                      {
                        name: "</language set:1206014845267480617>",
                        value:
                          guild.language === "fr"
                            ? "Permet de changer la langue du bot."
                            : `Allows you to change the bot's language.`,
                      },
                      {
                        name: "</language preview:1206014845267480617>",
                        value:
                          guild.language === "fr"
                            ? "Permet de montrer un example de la langue du bot."
                            : `Allows you to preview the bot's language with an example.`,
                      },
                      {
                        name: "</logs set:1206014844785000522>",
                        value:
                          guild.language === "fr"
                            ? "Permet de définir les paramètres des logs du bot"
                            : `Allows you to set the bot's logs settings.`,
                      },
                      {
                        name: "</logs toggle:1206014844785000522>",
                        value:
                          guild.language === "fr"
                            ? "Permet d'activer ou désactiver les logs du bot."
                            : `Allows you to toggle the bot's logs.`,
                      },
                      {
                        name: "</slowmode:1206014844785000521>",
                        value:
                          guild.language === "fr"
                            ? "Permet de changer le slowmode d'un salon."
                            : `Allows you to set the slowmode of a channel.`,
                      },
                    ],
                  },
                ],
              });
            }
          } else {
            if (choices === "utilities") {
              interaction.update({
                embeds: [
                  {
                    title: "🛠️ Utilities",
                    color: 0x6666ff,
                    thumbnail: {
                      url: this.client.user!.displayAvatarURL(),
                    },
                    fields: [
                      {
                        name: "</help:1205979101765173258>",
                        value: `Provides informations about a category of commands.`,
                      },
                      {
                        name: "</botinfo:1204396655840075788>",
                        value: `Provides informations about the bot.`,
                      },
                      {
                        name: "</profile:1204177049275732019>",
                        value: `Provides the profile of the user selected.`,
                      },
                      {
                        name: "</userinfo:1204183882149138472>",
                        value: `Provides informations about the user selected.`,
                      },
                      {
                        name: "</serverinfo:1204396655840075787>",
                        value: `Provides informations about the server.`,
                      },
                      {
                        name: "</ping:1209939749746249769>",
                        value: `Shows the bot's latency.`,
                      },
                      {
                        name: "</avatar:1209939749746249770>",
                        value: `Shows a user's avatar.`,
                      },
                      {
                        name: "</quote:1214343869567729666>",
                        value: "Get a random quote.",
                      },
                      {
                        name: "</weather:1215034912621600798>",
                        value: "Get the current weather of a location.",
                      },
                    ],
                  },
                ],
              });
            } else if (choices === "fun") {
              interaction.update({
                embeds: [
                  {
                    color: 0x6666ff,
                    title: "🎉 Fun",
                    thumbnail: { url: this.client.user!.displayAvatarURL() },
                    fields: [
                      {
                        name: "</magicball:1207786679742631967>",
                        value: `Ask a question to the magic ball.`,
                      },
                      {
                        name: "</tictactoe:1210221785849790495>",
                        value: `Play a game of tic tac toe with an AI or an opponent.`,
                      },
                      {
                        name: "</kiss:1211782590743187526>",
                        value: `Show your affection by kissing someone <3`,
                      },
                      {
                        name: "</hug:1211782590743187527>",
                        value: `Show your affection by hugging someone <3`,
                      },
                      {
                        name: "</joke:1213921432266874911>",
                        value: `Get a random joke.`,
                      },
                    ],
                  },
                ],
              });
            } else if (choices === "games") {
              interaction.update({
                embeds: [
                  {
                    title: "🎮 Games",
                    color: 0x6666ff,
                    thumbnail: {
                      url: this.client.user!.displayAvatarURL(),
                    },
                    fields: [
                      {
                        name: "</games tictactoe:1214304049063661598>",
                        value: `Play a game of tic tac toe with an AI or an opponent.`,
                      },
                      {
                        name: "</games 2048:1214304049063661598>",
                        value: `Play a game of 2048.`,
                      },
                      {
                        name: "</games rpc:1214304049063661598>",
                        value: `Play a game of Rock Paper Scissors with an opponent.`,
                      },
                      {
                        name: "</games snake:1214304049063661598>",
                        value: `Play a game of snake.`,
                      },
                      {
                        name: "</games slots:1214304049063661598>",
                        value: `Play a game of slots`,
                      },
                    ],
                  },
                ],
              });
            } else if (choices === "economy") {
              interaction.update({
                embeds: [
                  {
                    title: "💸 Economy",
                    color: 0x6666ff,
                    thumbnail: {
                      url: this.client.user!.displayAvatarURL(),
                    },
                    fields: [
                      {
                        name: "</account create:1204810971416236072>",
                        value: "Creates a new bank account.",
                      },
                      {
                        name: "</account delete:1204810971416236072>",
                        value: `Deletes your bank account. We can't undo this action.`,
                      },
                      {
                        name: "</account informations:1204810971416236072>",
                        value: `Get informations about your bank account.`,
                      },
                      {
                        name: "</job list:1205982914131791973>",
                        value: `Allows you to see the list of all available jobs.`,
                      },
                      {
                        name: "</job change:1205982914131791973>",
                        value: `Allows you to change your job.`,
                      },
                      {
                        name: "</job informations:1205982914131791973>",
                        value: `Provides informations about your current job.`,
                      },
                      {
                        name: "</work:1209577162487631872>",
                        value: "Allows you to work.",
                      },
                    ],
                  },
                ],
              });
            } else if (choices === "moderation") {
              interaction.update({
                embeds: [
                  {
                    title: "🛡️ Moderation",
                    color: 0x6666ff,
                    thumbnail: {
                      url: this.client.user!.displayAvatarURL(),
                    },
                    fields: [
                      {
                        name: "</timeout add:1203786292404682752>",
                        value: `Adds a timeout to the user selected.`,
                      },
                      {
                        name: "</timeout remove:1203786292404682752>",
                        value: `Removes a timeout from the user selected.`,
                      },
                      {
                        name: "</ban add:1203429758977839174>",
                        value: "Bans the selected user from the server.",
                      },
                      {
                        name: "</ban remove:1203429758977839174>",
                        value: "Unbans the selected user from the server.",
                      },
                      {
                        name: "</kick:1203779567886536714>",
                        value: "Kicks the selected user from the server.",
                      },
                      {
                        name: "</clear:1204118823075188806>",
                        value:
                          "Clears a selected amount of messages in a channel.",
                      },
                    ],
                  },
                ],
              });
            } else if (choices === "administration") {
              interaction.update({
                embeds: [
                  {
                    title: "🔐 Administration",
                    color: 0x6666ff,
                    thumbnail: {
                      url: this.client.user!.displayAvatarURL(),
                    },
                    fields: [
                      {
                        name: "</protection scan:1213599917524779069>",
                        value: `Scans the server to find blacklisted users.`,
                      },
                      {
                        name: "</protection mentions:1213599917524779069>",
                        value: `Set a limit for mentions in a message.`,
                      },
                      {
                        name: "</protection messages:1213599917524779069>",
                        value: `Deletes message including a link or an invite if the user does not have the \`Manage Messages\` permission.`,
                      },
                      {
                        name: "</protection blacklist:1213599917524779069>",
                        value: `Prevents blacklisted users from joining the server.`,
                      },
                      {
                        name: "</announcement:1206014845267480618>",
                        value: `Allows you to create an announcement.`,
                      },
                      {
                        name: "</language set:1206014845267480617>",
                        value: `Allows you to change the bot's language.`,
                      },
                      {
                        name: "</language preview:1206014845267480617>",
                        value: `Allows you to preview the bot's language with an example.`,
                      },
                      {
                        name: "</logs set:1206014844785000522>",
                        value: `Allows you to set the bot's logs settings.`,
                      },
                      {
                        name: "</logs toggle:1206014844785000522>",
                        value: `Allows you to toggle the bot's logs settings.`,
                      },
                      {
                        name: "</slowmode:1206014844785000521>",
                        value: `Allows you to set the slowmode of a channel.`,
                      },
                    ],
                  },
                ],
              });
            }
          }
        } else {
          console.log("boop");
        }
      }
    });
  }
}
