import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import CommandCounter from "../../base/schemas/CommandCounter";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class StatsCommands extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "stats.commands",
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let commandCounter = await CommandCounter.findOne({ global: 1 });
    let guild = await GuildConfig.findOne({ id: interaction.guildId });

    commandCounter!.stats.commands.used += 1;
    await commandCounter?.save();

    await interaction.deferReply();

    if (guild && guild.language) {
      return interaction.editReply({
        embeds: [
          {
            color: 0x6666ff,
            title:
              guild.language === "fr"
                ? "Statistiques des commandes"
                : `Commands Statistics`,
            thumbnail: { url: this.client.user?.displayAvatarURL()! },
            description: `
                      __**🛠️ ${
                        guild.language === "fr" ? "Utilitaires" : "Utilities"
                      }**__
  
                      > BotInfo: **${commandCounter!.botInfo.used}**
                      > Help: **${commandCounter!.help.used}**
                      > Profile: **${commandCounter!.profile.used}**
                      > ServerInfo: **${commandCounter!.serverInfo.used}**
                      > Stats - Commands: **${
                        commandCounter!.stats.commands.used
                      }**
                      > UserInfo: **${commandCounter!.userInfo.used}**
                      > Ping: **${commandCounter!.ping.used}**
                      > Avatar: **${commandCounter!.avatar.used}** 
                      > Quote: **${commandCounter!.quote.used}**

                      __**🎉 Fun**__
                      
                      > Kiss: **${commandCounter!.kiss.used}**
                      > Hug: **${commandCounter!.hug.used}**
                      > MagicBall: **${commandCounter!.magicball.used}**
                      > Joke: **${commandCounter!.joke.used}**

                      __**🎮 ${guild.language === "fr" ? "Jeux" : "Games"}**__

                      > Games - TicTacToe: **${
                        commandCounter!.games.tictactoe.used
                      }**
                      > Games - 2048 : **${
                        commandCounter!.games.twozerofoureight.used
                      }**
                      > Games - RPC : **${commandCounter!.games.rpc.used}**
                      > Games - Slots: **${commandCounter!.games.slots.used}**
                      > Games - Snake: **${commandCounter!.games.snake.used}**
                      
                      __**💸 ${
                        guild.language === "fr" ? "Economie" : "Economy"
                      }**__
  
                      > Account - Create: **${
                        commandCounter!.account.accountCreate.used
                      }**
                      > Account - Delete: **${
                        commandCounter!.account.accountDelete.used
                      }**
                      > Account - Informations: **${
                        commandCounter!.account.accountInformations.used
                      }**
                      > Job - Change: **${commandCounter!.job.jobChange.used}**
                      > Job - Informations: **${
                        commandCounter!.job.jobInformations.used
                      }**
                      > Job - List: **${commandCounter!.job.jobList.used}**
                      > Job - Delete: **${commandCounter!.job.jobDelete.used}**
                      
                      __**🛡️ ${
                        guild.language === "fr" ? "Modération" : "Moderation"
                      }**__
  
                      > Clear: **${commandCounter!.clear.used}**
                      > Kick: **${commandCounter!.kick.used}**
                      > Timeout - Add: **${
                        commandCounter!.timeout.timeoutAdd.used
                      }**
                      > Timeout - Remove: **${
                        commandCounter!.timeout.timeoutRemove.used
                      }**
                      > Ban - Add: **${commandCounter!.ban.banAdd.used}**
                      > Ban - Remove: **${commandCounter!.ban.banRemove.used}**
  
                      __**🔐 Administration**__
  
                      > Protection - Scan: **${
                        commandCounter!.protection.scan.used
                      }**
                      > Protection - Blacklist: **${
                        commandCounter!.protection.blacklist.used
                      }**
                      > Protection - Mentions: **${
                        commandCounter!.protection.mentions.used
                      }**
                      > Protection - Messages: **${
                        commandCounter!.protection.messages.used
                      }**
                      > Protection - Delete: **${
                        commandCounter!.protection.delete.used
                      }**
                      > Announcement: **${commandCounter!.announcement.used}**
                      > Language - Set: **${
                        commandCounter!.language.languageSet.used
                      }**
                      > Language - Preview: **${
                        commandCounter!.language.languagePreview.used
                      }**
                      > Logs - Set: **${commandCounter!.logs.logsSet.used}**
                      > Logs - Toggle: **${
                        commandCounter!.logs.logsToggle.used
                      }**
                      > Slowmode: **${commandCounter!.slowmode.used}**
  
                      `,
          },
        ],
      });
    } else {
      // DONT CHANGE DONT CHANGE DONT CHANGE
      return interaction.editReply({
        embeds: [
          {
            color: 0x6666ff,
            title: `Commands Statistics`,
            thumbnail: { url: this.client.user?.displayAvatarURL()! },
            description: `
                      __**🛠️ Utilities**__
  
                      > BotInfo: **${commandCounter!.botInfo.used}**
                      > Help: **${commandCounter!.help.used}**
                      > Profile: **${commandCounter!.profile.used}**
                      > ServerInfo: **${commandCounter!.serverInfo.used}**
                      > Stats - Commands: **${
                        commandCounter!.stats.commands.used
                      }**
                      > UserInfo: **${commandCounter!.userInfo.used}**
                      > Ping: **${commandCounter!.ping.used}**
                      > Avatar: **${commandCounter!.avatar.used}**
                      > Quote: **${commandCounter!.quote.used}**

                      __**🎉 Fun**__
                      
                      > Kiss: **${commandCounter!.kiss.used}**
                      > Hug: **${commandCounter!.hug.used}**
                      > MagicBall: **${commandCounter!.magicball.used}**
                      > Joke: **${commandCounter!.joke.used}**
                      
                      __**🎮 Games**__

                      > Games - TicTacToe: **${
                        commandCounter!.games.tictactoe.used
                      }**
                      > Games - 2048 : **${
                        commandCounter!.games.twozerofoureight.used
                      }**
                      > Games - RPC : **${commandCounter!.games.rpc.used}**
                      > Games - Slots: **${commandCounter!.games.slots.used}**
                      > Games - Snake: **${commandCounter!.games.snake.used}**

                      __**💸 Economy**__
  
                      > Account - Create: **${
                        commandCounter!.account.accountCreate.used
                      }**
                      > Account - Delete: **${
                        commandCounter!.account.accountDelete.used
                      }**
                      > Account - Informations: **${
                        commandCounter!.account.accountInformations.used
                      }**
                      > Job - Change: **${commandCounter!.job.jobChange.used}**
                      > Job - Informations: **${
                        commandCounter!.job.jobInformations.used
                      }**
                      > Job - List: **${commandCounter!.job.jobList.used}**
                      > Job - Delete: **${commandCounter!.job.jobDelete.used}**
                      
                      __**🛡️ Moderation**__
  
                      > Clear: **${commandCounter!.clear.used}**
                      > Kick: **${commandCounter!.kick.used}**
                      > Timeout - Add: **${
                        commandCounter!.timeout.timeoutAdd.used
                      }**
                      > Timeout - Remove: **${
                        commandCounter!.timeout.timeoutRemove.used
                      }**
                      > Ban - Add: **${commandCounter!.ban.banAdd.used}**
                      > Ban - Remove: **${commandCounter!.ban.banRemove.used}**
  
                      __**🔐 Administration**__
  
                      > Protection - Scan: **${
                        commandCounter!.protection.scan.used
                      }**
                      > Protection - Blacklist: **${
                        commandCounter!.protection.blacklist.used
                      }**
                      > Protection - Mentions: **${
                        commandCounter!.protection.mentions.used
                      }**
                      > Protection - Messages: **${
                        commandCounter!.protection.messages.used
                      }**
                      > Protection - Delete: **${
                        commandCounter!.protection.delete.used
                      }**
                      > Announcement: **${commandCounter!.announcement.used}**
                      > Language - Set: **${
                        commandCounter!.language.languageSet.used
                      }**
                      > Language - Preview: **${
                        commandCounter!.language.languagePreview.used
                      }**
                      > Logs - Set: **${commandCounter!.logs.logsSet.used}**
                      > Logs - Toggle: **${
                        commandCounter!.logs.logsToggle.used
                      }**
                      > Slowmode: **${commandCounter!.slowmode.used}**
  
                      `,
          },
        ],
      });
    }
  }
}
