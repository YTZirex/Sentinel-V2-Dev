import { Events, Guild, TextChannel } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class GuildDelete extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.GuildDelete,
      description: "Guild Delete Event",
      once: false,
    });
  }

  async Execute(guild: Guild) {
    try {
      await GuildConfig.deleteOne({
        id: guild.id,
      });
    } catch (err) {
      console.log(err);
    }

    (
      (await this.client.channels.fetch("1213602474653515806")) as TextChannel
    ).setName(
      `📜 ${this.client.guilds.cache.size} servers!`,
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
                value: `${guild.memberCount}`,
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
}
