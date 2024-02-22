import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import TicTacToe from "discord-tictactoe";
import Category from "../../base/enums/Category";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  PermissionsBitField,
} from "discord.js";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class TicTacToeCommand extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "tictactoe",
      description: `Play a game of tic tac toe !`,
      dev: false,
      cooldown: 3,
      category: Category.Fun,
      options: [
        {
          name: "user",
          description: "The user to play with",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
      dm_permission: false,
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let guild = await GuildConfig.findOne({ id: interaction.guildId });

    if (guild && guild.language === "fr") {
      let game = new TicTacToe({ language: "fr" });
      game.handleInteraction(interaction);
    } else {
      let game = new TicTacToe({ language: "en" });
      game.handleInteraction(interaction);
    }
  }
}
