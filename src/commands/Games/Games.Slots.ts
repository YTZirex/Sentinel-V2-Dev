import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";
import SubCommand from "../../base/classes/SubCommand";
import CommandCounter from "../../base/schemas/CommandCounter";

const { Slots } = require("discord-gamecord");

export default class GamesSlots extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "games.slots",
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {

    let commandCounter = await CommandCounter.findOne({ global: 1 });

    commandCounter!.games.slots.used += 1;
    await commandCounter?.save();

    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    const Game = new Slots({
      message: interaction,
      isSlashGame: true,
      embed: {
        title:
          guild && guild.language === "fr" ? "Machine à sous" : "Slot Machine",
        color: "#6666FF",
      },

      slots: ["🍇", "🍌", "🪙", "🍎"],
    });
    Game.startGame();
    Game.on("gameOver", (result: any) => {
      return;
    });
  }
}
