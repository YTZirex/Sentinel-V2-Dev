import { Events, Guild, TextChannel } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import GuildConfig from "../../base/schemas/GuildConfig";
import BlacklistedUser from "../../base/schemas/BlacklistedUser";
import GuildProtection from "../../base/schemas/GuildProtection";

export default class GuildDelete extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.GuildDelete,
      description: "Guild Delete Event",
      once: false,
    });
  }

  async Execute(guild: Guild) {
    let blacklisted = await BlacklistedUser.findOne({
      id: guild.ownerId,
    });

    try {
      await GuildConfig.deleteOne({
        id: guild.id,
      });
      await GuildProtection.deleteOne({
        id: guild.id,
      });
    } catch (err) {
      console.log(err);
    }

    if (blacklisted?.blacklisted === true) {
      return false;
    }
    let guildsFetchedSize = (await this.client.guilds.fetch()).size;
    (
      (await this.client.channels.fetch("1215260641003044874")) as TextChannel
    ).setName(
      `📜 ${this.separateNumbers(guildsFetchedSize)} servers!`,
      "New Server Removed"
    );

    (
      (await this.client.channels.fetch("1214288643351384074")) as TextChannel
    ).setName(
      `📈 ${this.separateNumbers(
        this.client.guilds.cache
          .map((guild) => guild.memberCount)
          .reduce((a, b) => a + b, 0)
      )} users!`,
      "New Server Removed"
    );

    (
      (await this.client.channels.fetch("1214285990689247233")) as TextChannel
    ).setName(
      `🚀${this.separateNumbers(
        this.client.guilds.cache
          .map((guild) => guild.memberCount)
          .reduce((a, b) => a + b, 0)
      )} / ${this.separateNumbers(
        this.getNextMemberMilestone(
          this.client.guilds.cache
            .map((guild) => guild.memberCount)
            .reduce((a, b) => a + b, 0)
        )
      )} users!`,
      "New Server Removed"
    );

    (
      (await this.client.channels.fetch("1216090409630171207")) as TextChannel
    ).setName(
      `🚀${this.separateNumbers(guildsFetchedSize)}/${this.separateNumbers(
        this.getNextGuildsMilestone((await this.client.guilds.fetch()).size)
      )} servers!`,
      "New Server Removed"
    );

    ((await this.client.channels.fetch("1209839875201966151")) as TextChannel)
      .send({
        embeds: [
          {
            title: "I was removed from a server !",
            color: 0xff6666,
            thumbnail: {
              url: guild.iconURL() || this.client.user?.displayAvatarURL()!,
            },
            description: `I am now in **${
              (await this.client.guilds.fetch()).size
            } servers**.`,
            fields: [
              {
                name: "Server Name:",
                value: guild.name,
              },
              {
                name: "Server ID:",
                value: guild.id,
              },
              {
                name: "Server Description:",
                value: guild.description || "None",
              },
              {
                name: "Member Count:",
                value: `${this.separateNumbers(guild.memberCount)}`,
              },
              {
                name: "Owner:",
                value: (await guild.fetchOwner()).user.username,
              },
              {
                name: "Owner ID:",
                value: guild.ownerId,
              },
              {
                name: "Boost Level:",
                value: `${guild.premiumTier}`,
              },
              {
                name: "Total Boosts:",
                value: `${guild.premiumSubscriptionCount}`,
              },
            ],
          },
        ],
      })
      .then((x) => x.crosspost())
      .then((x) => x.react("📜"))
      .catch();
  }
  private getNextMemberMilestone(currentMembers: number) {
    let milestone;
    if (currentMembers < 100) {
      milestone = Math.ceil(currentMembers / 25) * 25;
    } else if (currentMembers >= 100 && currentMembers < 1000) {
      milestone = Math.ceil(currentMembers / 100) * 100;
    } else {
      milestone = Math.ceil(currentMembers / 250) * 250;
    }
    // If the current member count equals the milestone, calculate the next milestone
    if (currentMembers === milestone) {
      if (currentMembers < 100) {
        milestone += 25;
      } else if (currentMembers >= 100 && currentMembers < 1000) {
        milestone += 100;
      } else {
        milestone += 250;
      }
    }
    return milestone;
  }

  private getNextGuildsMilestone(currentGuilds: number) {
    let milestone;
    if (currentGuilds < 50) {
      milestone = Math.ceil(currentGuilds / 10) * 10;
    } else if (currentGuilds >= 50 && currentGuilds < 100) {
      milestone = Math.ceil(currentGuilds / 25) * 25;
    } else {
      milestone = Math.ceil(currentGuilds / 100) * 100;
    }
    return milestone;
  }

  private separateNumbers(number: number) {
    // Convert the number to a string
    let numberString = number.toString();

    // Split the string into groups of three digits from the end
    let separatedNumber = [];
    let group = "";
    for (let i = numberString.length - 1; i >= 0; i--) {
      group = numberString[i] + group;
      if (group.length === 3 || i === 0) {
        separatedNumber.unshift(group);
        group = "";
      }
    }

    // Join the groups with spaces
    return separatedNumber.join(" ");
  }
}
