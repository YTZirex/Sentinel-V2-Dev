import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";
import SubCommand from "../../base/classes/SubCommand";
import CommandCounter from "../../base/schemas/CommandCounter";

const { Snake } = require("discord-gamecord");

export default class GamesSnake extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "games.snake",
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let guild = await GuildConfig.findOne({ id: interaction.guildId });

    let commandCounter = await CommandCounter.findOne({ global: 1 });

    commandCounter!.games.snake.used += 1;
    await commandCounter?.save();

    const Game = new Snake({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Snake",
        overTitle:
          guild && guild.language === "fr" ? "Fin du jeu" : "Game Over",
        color: "#5865F2",
      },
      emojis: {
        board: "⬛",
        food: "🍎",
        up: "⬆️",
        down: "⬇️",
        left: "⬅️",
        right: "➡️",
      },
      snake: { head: "🟢", body: "🟩", tail: "🟢", skull: "💀" },
      foods: ["🍎", "🍇", "🍊", "🫐", "🥕", "🥝", "🌽"],
      stopButton: "Stop",
      timeoutTime: 60000,
      playerOnlyMessage:
        guild && guild.language === "fr"
          ? `Seul {player} peut utiliser ces boutons.`
          : "Only {player} can use these buttons.",
    });
    Game.startGame();
    Game.on("gameOver", (result: any) => {
      return;
    });
  }
}
