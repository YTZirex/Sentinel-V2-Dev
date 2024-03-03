import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";
import BlacklistedUser from "../../base/schemas/BlacklistedUser";
import { black } from "colors";

export default class ProtectionScan extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "protection.scan",
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    let guildProtection = await GuildConfig.findOne({
      id: interaction.guildId,
    });

    let kickUser = interaction.options.getBoolean("kick");

    let BlacklistedUsers: any = [];
    let blacklistedUsersCount: number = 0;

    for (const member of interaction.guild?.members.cache.values()!) {
      let blacklisted = await BlacklistedUser.findOne({ id: member.id });

      if (blacklisted?.blacklisted === true) {
        BlacklistedUsers.push(`${member.user.username} - ${member.id}`);
        blacklistedUsersCount += 1;
        if (kickUser === true) {
          try {
            await member.kick(`Blacklisted from Sentinel.`);
          } catch (err) {
            console.error(
              `Failed to kick member ${member.user.username}: ${err}`
            );
          }
        }
      }
    }

    var formattedList = BlacklistedUsers.map(function (user: any, index: any) {
      return index + 1 + " - " + user;
    }).join("\n");

    return interaction.reply({
      embeds: [
        /*  {
          color: blacklistedUsersCount === 0 ? 0x33cc99 : 0xff6666,
          title: guild && guild.language === "fr" ? `Succès!` : "Success!",
          description:
            guild && guild.language === "fr"
              ? `**${blacklistedUsersCount}** utilisateurs trouvé(s)  ${
                  kickUser === true ? `et expulsé(s) !` : "!"
                }`
              : `**${blacklistedUsersCount}** users were found ${
                  kickUser === true ? `and kicked !` : `!`
                }`,
        },*/
        {
          color: blacklistedUsersCount === 0 ? 0x33cc99 : 0xff6666,
          title:
            guild && guild.language === "fr"
              ? `Liste des utilisateurs (**${blacklistedUsersCount}**)`
              : `List of users (**${blacklistedUsersCount}**)`,
          description:
            blacklistedUsersCount === 0
              ? `${guild && guild.language === "fr" ? "Aucun" : "None"}`
              : `${formattedList}`,
          thumbnail: { url: interaction.guild?.iconURL()! },
        },
      ],
    });
  }
}
