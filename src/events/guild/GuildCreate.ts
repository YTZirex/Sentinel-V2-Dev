import { EmbedBuilder, Events, Guild, TextChannel } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class GuildCreate extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.GuildCreate,
      description: "Guild Create Event",
      once: false,
    });
  }
  async Execute(guild: Guild) {
    try {
      if (!(await GuildConfig.exists({ id: guild.id })))
        await GuildConfig.create({ id: guild.id });
    } catch (err) {
      console.log(err);
    }

    const owner = await guild.fetchOwner();
    owner
      ?.send({
        embeds: [
          {
            color: 0x33cc99,
            thumbnail: { url: this.client.user?.displayAvatarURL()! },
            description: `Hey! Thanks for inviting me to your server!\n\nYou can edit my language by using the command </language set:1206014845267480617>.`,
          },
        ],
      })
      .catch();

    (
      (await this.client.channels.fetch("1213602474653515806")) as TextChannel
    ).setName(
      `📜 ${this.client.guilds.cache.size} servers!`,
      "New Server Added"
    );

    ((await this.client.channels.fetch("1209839875201966151")) as TextChannel)
      .send({
        embeds: [
          {
            title: "I was added to a new server !",
            color: 0x33cc99,
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
