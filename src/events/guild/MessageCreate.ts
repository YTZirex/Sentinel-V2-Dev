import {
  Message,
  ChatInputCommandInteraction,
  Events,
  MessageType,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

export default class MessageCreate extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.MessageCreate,
      once: false,
      description: "message create event",
    });
  }
  async Execute(message: Message) {
    if (message.author.bot) return false;

    /// if bot pinged
    if (message.content.includes(`<@${this.client.user!.id}>`)) {
      message.reply(
        `Hey, I'm Sentinel! You can see my commands using </help:1205979101765173258>.`
      );
    }
  }
}
