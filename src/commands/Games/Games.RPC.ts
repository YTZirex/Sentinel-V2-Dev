import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";
import SubCommand from "../../base/classes/SubCommand";
import CommandCounter from "../../base/schemas/CommandCounter";

const { RockPaperScissors } = require("discord-gamecord");

export default class GamesRPC extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "games.rpc",
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {

    let commandCounter = await CommandCounter.findOne({ global: 1 });

    commandCounter!.games.rpc.used += 1;
    await commandCounter?.save();

    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    let target = interaction.options.getUser("opponent")!;
    if (interaction.user.id === target.id) {
      return interaction.reply({
        content:
          guild && guild.language === "fr"
            ? "Vous ne pouvez pas jouer contre vous même!"
            : `You can not play agains't yourself!`,
        ephemeral: true,
      });
    }
    const Game = new RockPaperScissors({
      message: interaction,
      isSlashGame: false,
      opponent: target,
      embed: {
        title:
          guild && guild.language === "fr"
            ? "Pierre Feuille Ciseaux"
            : "Rock Paper Scissors",
        color: "#5865F2",
        description:
          guild && guild.language === "fr"
            ? "Appuyer sur un bouton en dessous pour faire un choix."
            : "Press a button below to make a choice.",
      },
      buttons: {
        rock: guild && guild.language === "fr" ? "Pierre" : "Rock",
        paper: guild && guild.language === "fr" ? "Feuille" : "Paper",
        scissors: guild && guild.language === "fr" ? "Ciseaux" : "Scissors",
      },
      emojis: {
        rock: "🌑",
        paper: "📰",
        scissors: "✂️",
      },
      mentionUser: true, 
      timeoutTime: 60000,
      buttonStyle: "PRIMARY",
      pickMessage:
        guild && guild.language === "fr"
          ? "Vous avez choisi {emoji}."
          : "You choose {emoji}.",
      winMessage:
        guild && guild.language === "fr"
          ? "**{player}** a gagné la partie! Félicitations!"
          : "**{player}** won the Game! Congratulations!",
      tieMessage:
        guild && guild.language === "fr"
          ? "La partie finie en égalité! Personne n'a gagné la partie!"
          : "The Game tied! No one won the Game!",
      timeoutMessage:
        guild && guild.language === "fr"
          ? "La partie ne s'est pas terminé! Personne n'a gagné la partie!"
          : "The Game went unfinished! No one won the Game!",
      playerOnlyMessage:
        guild && guild.language === "fr"
          ? "Seul {player} et {opponent} peuvent utiliser ces boutons."
          : "Only {player} and {opponent} can use these buttons.",
    });
    Game.startGame();
    Game.on("gameOver", (result: any) => {
      return;
    });
  }
}
