import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";
import SubCommand from "../../base/classes/SubCommand";
import CommandCounter from "../../base/schemas/CommandCounter";

const { TwoZeroFourEight } = require("discord-gamecord");

export default class Games2048 extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "games.2048",
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {

    let commandCounter = await CommandCounter.findOne({ global: 1 });

    commandCounter!.games.twozerofoureight.used += 1;
    await commandCounter?.save();

    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    const Game = new TwoZeroFourEight({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "2048",
        color: "#5865F2",
      },
      emojis: {
        up: "⬆️",
        down: "⬇️",
        left: "⬅️",
        right: "➡️",
      },
      timeoutTime: 60000,
      buttonStyle: "PRIMARY",
      playerOnlyMessage:
        guild && guild.language === "fr"
          ? `Seulement {player} peut utiliser ces boutons.`
          : "Only {player} can use these buttons.",
    });
    Game.startGame();
    Game.on("gameOver", (result: any) => {
      return;
    });
  }
}
