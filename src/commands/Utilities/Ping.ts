import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";
import CommandCounter from "../../base/schemas/CommandCounter";

export default class Ping extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "ping",
      description: `Shows the bot's latency.`,
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      dev: false,
      dm_permission: false,
      cooldown: 3,
      category: Category.Utilities,
      options: [],
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    const start = performance.now();

    const apiLatency = this.client.ws.ping;

    const mongooseStart = Date.now();
    const mongooseLatency = Date.now() - mongooseStart;

    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    let commandCounter = await CommandCounter.findOne({ global: 1 });

    commandCounter!.ping.used += 1;
    await commandCounter?.save();

    await interaction.deferReply();
    const end = performance.now();
    const botPing = Math.floor(end - start);
    interaction.editReply({
      embeds: [
        {
          title:
            guild && guild.language === "fr"
              ? `Latences des services de **${this.client.user!.username}**`
              : `**${this.client.user!.username}**'s services latencies`,
          description:
            guild && guild.language === "fr"
              ? `> \`⏱️\` La latence du **Bot** est \`${botPing}ms\`\n
              > \`🌐\` La latence de l'**API Discord** est \`${apiLatency}ms\`\n
              > \`🌿\` La latence de la **Base de données** est \`${mongooseLatency}ms\``
              : `> \`⏱️\` **Bot**'s latency is \`${botPing}ms\`\n
              > \`🌐\` **Discord API**'s latency is \`${apiLatency}ms\`\n
              > \`🌿\` **Database**'s latency is \`${mongooseLatency}ms\``,
          color: 0x7289da,
          author: {
            name: interaction.user.username,
            icon_url: interaction.user.displayAvatarURL(),
          },
          footer: {
            text:
              guild && guild.language === "fr"
                ? `Demandé par ${interaction.user.username}`
                : `Requested by ${interaction.user.username}`,
            icon_url: this.client.user!.displayAvatarURL(),
          },
          // timestamp: `${new Date()}`,
          thumbnail: {
            url: this.client.user!.displayAvatarURL(),
          },
        },
      ],
    });
  }
}
