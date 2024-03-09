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
import CommandCounter from "../../base/schemas/CommandCounter";
import SubCommand from "../../base/classes/SubCommand";

export default class TicTacToeCommand extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "games.tictactoe",
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let guild = await GuildConfig.findOne({ id: interaction.guildId });

    let commandCounter = await CommandCounter.findOne({ global: 1 });

    commandCounter!.games.tictactoe.used += 1;
    await commandCounter?.save();

    if (guild && guild.language === "fr") {
      let game = new TicTacToe({ language: "fr" });
      game.handleInteraction(interaction);
    } else {
      let game = new TicTacToe({ language: "en" });
      game.handleInteraction(interaction);
    }
  }
}
