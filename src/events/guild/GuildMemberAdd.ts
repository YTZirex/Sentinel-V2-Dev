import { Events, GuildMember, TextChannel } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import BlacklistedUser from "../../base/schemas/BlacklistedUser";
import GuildProtection from "../../base/schemas/GuildProtection";

export default class GuildMemberAdd extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.GuildMemberAdd,
      description: "Guild Delete Event",
      once: false,
    });
  }
  async Execute(member: GuildMember) {
    let blacklist = await BlacklistedUser.findOne({ id: member.id });
    let guildProtection = await GuildProtection.findOne({
      id: member.guild.id,
    });
    if (blacklist?.blacklisted === true) {
      if (member.guild.id !== "1031586420575457341") {
        if (
          guildProtection &&
          guildProtection?.protection.blacklist.enabled === true
        ) {
          if (
            member.kickable &&
            member.guild.members.me?.permissions.has("KickMembers")
          ) {
            try {
              member.kick(`Blacklisted from Sentinel.`);
              const owner = member.guild.fetchOwner();
              (await owner).send(
                `The user **<@${member.id}>** has been kicked from your server **${member.guild.name}** as they were blacklisted from Sentinel.`
              );
            } catch (err) {
              const owner = member.guild.fetchOwner();
              (await owner).send(
                `The user **<@${member.id}>** in your server **${member.guild.name}** is blacklisted from Sentinel but I was not able to kick them.`
              );
            }
          }
        }
      }
    }

    if (member.guild.id === "1031586420575457341") {
      try {
        console.log(
          `⏳ [SUPPORT] Adding role to ${member.user.username}.`.yellow
        );
        member.roles.add("1159171919237627945", "Joined the server.");
        member.send({
          embeds: [
            {
              color: 0x33cc99,
              title: `Thank you for joining our Support!`,
              thumbnail: { url: member.guild.iconURL()! },
            },
          ],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 5,
                  label: "Invite me !",
                  url: "https://discord.com/api/oauth2/authorize?client_id=1203014293549744189&permissions=70368744177655&scope=applications.commands+bot",
                  emoji: "🔗",
                },
              ],
            },
          ],
        });
        console.log(
          `✅ [SUPPORT] Added role to ${member.user.username}.`.green
        );
        (
          (await this.client.channels.fetch(
            "1187090843568439316"
          )) as TextChannel
        )
          .send({
            embeds: [
              {
                title: `Welcome ${member.user.username} !`,
                description: `Thank you for joining our Support!\n\nWe are now **${member.guild.memberCount} members.**`,
                thumbnail: { url: member.user.displayAvatarURL() },
                color: 0x6666ff,
              },
            ],
          })
          .then((x) => x.react("👋"));
      } catch (err) {
        (
          (await this.client.channels.fetch(
            "1159171950149640254"
          )) as TextChannel
        ).send(
          `<@&1159171911595597956>, the user <@${member.id}> did not receive their role.`
        );
      }
    }
  }
}
