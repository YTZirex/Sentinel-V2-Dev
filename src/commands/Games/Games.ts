import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Games extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "games",
      description: `Play one of many games available.`,
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      cooldown: 3,
      dm_permission: false,
      category: Category.Games,
      premium: false,
      dev: false,
      options: [
        {
          name: "tictactoe",
          description: `Play a game of tic tac toe!`,
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "The user to play with",
              type: ApplicationCommandOptionType.String,
              required: false,
            },
          ],
        },
        {
          name: "slots",
          description: `Play a game of slots!`,
          type: ApplicationCommandOptionType.Subcommand,
          options: [],
        },
        {
          name: "2048",
          description: "Play a game of 2048!",
          type: ApplicationCommandOptionType.Subcommand,
          options: [],
        },
        {
          name: "rpc",
          description: `Play a game of rock paper scissors!`,
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "opponent",
              description: "The opponent to play with",
              type: ApplicationCommandOptionType.User,
              required: true,
            },
          ],
        },
        {
          name: "snake",
          description: "Play a game of snake!",
          type: ApplicationCommandOptionType.Subcommand,
          options: [],
        },
      ],
    });
  }
}
