import {
  Message,
  ChatInputCommandInteraction,
  Events,
  MessageType,
  PermissionsBitField,
  Permissions,
  PermissionFlagsBits,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import GuildProtection from "../../base/schemas/GuildProtection";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class MessageCreate extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.MessageCreate,
      once: false,
      description: "message create event",
    });
  }
  async Execute(message: Message) {
    let guildProtection = await GuildProtection.findOne({
      id: message.guildId,
    });

    let guild = await GuildConfig.findOne({
      id: message.guildId,
    });

    //// BOT PINGED

    if (message.author.id === "1203014293549744189") return false;
    if (message.author.id === "1203400577242107934") return false;

    if (message.content.includes(`<@${this.client.user!.id}>`)) {
      if (message.author.bot) return false;
      message.reply(
        `Hey, I'm Sentinel! You can see my commands using </help:1205979101765173258>.`
      );
    }

    //// GUILD PROTECTION

    // anti invite
    if (
      message.content.toLowerCase().includes(".gg/") ||
      message.content.toLowerCase().includes("gg/") ||
      message.content.toLowerCase().includes("discord.gg/") ||
      message.content.toLowerCase().includes("discordapp.com/invite/") ||
      message.content.toLowerCase().includes("discord.com/invite/")
    ) {
      if (
        guildProtection &&
        guildProtection.protection.messages.invites === true
      ) {
        if (message.member?.permissions.has("ManageMessages")) return false;
        if (
          message.member?.guild.members.me?.permissions.has("ManageMessages")
        ) {
          if (message.author.id === "1203014293549744189") return false;
          if (message.author.id === "1203400577242107934") return false;

          message.delete();
          message.channel.send(
            `<@${message.author.id}>, ${
              guild && guild.language === "fr"
                ? "Vous ne pouvez pas envoyer des invitations sur ce serveur."
                : "You can't send invites in this server."
            }`
          );
        }
      }
    }

    //anti-link

    if (
      message.content.toLowerCase().includes("http://") ||
      message.content.toLowerCase().includes("https://") ||
      message.content.toLowerCase().includes("www.")
    ) {
      if (
        guildProtection &&
        guildProtection.protection.messages.links === true
      ) {
        if (message.member?.permissions.has("ManageMessages")) return false;
        if (
          message.member?.guild.members.me?.permissions.has("ManageMessages")
        ) {
          if (message.author.id === "1203014293549744189") return false;
          if (message.author.id === "1203400577242107934") return false;
          message.delete();
          message.channel.send(
            `<@${message.author.id}>, ${
              guild && guild.language === "fr"
                ? "Vous ne pouvez pas envoyer des liens sur ce serveur."
                : "You can't send links in this server."
            }`
          );
        }
      }
    }

    //mentions limit
    if (
      guildProtection &&
      guildProtection.protection.mentions.max.enabled === true
    ) {
      let content = message.content.split(" ");
      let count = 0;

      for (let i = 0; i < content.length; i++) {
        if (content[i].match(new RegExp(/<@!*&*[0-9]+>/g))) count++;
      }

      if (count > guildProtection.protection.mentions.max.limit) {
        if (message.member?.permissions.has("ManageMessages")) return false;

        message.delete();
        message.channel.send(
          `<@${message.author.id}>, ${
            guild && guild.language === "fr"
              ? `Vous ne pouvez pas envoyer plus de **${guildProtection.protection.mentions.max.limit}** mentions sur ce serveur.`
              : `You can't send more than **${guildProtection.protection.mentions.max.limit}** mentions in this server.`
          }`
        );
      }
    }
  }
}
