import {
  ChatInputCommandInteraction,
  Collection,
  EmbedBuilder,
  Events,
  TextChannel,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import Command from "../../base/classes/Command";
import UserConfig from "../../base/schemas/UserConfig";
import BlacklistedUser from "../../base/schemas/BlacklistedUser";
import GuildConfig from "../../base/schemas/GuildConfig";
import Category from "../../base/enums/Category";
import PremiumUser from "../../base/schemas/PremiumUser";

export default class CommandHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.InteractionCreate,
      description: "Command Handler Event",
      once: false,
    });
  }

  private uptimeString(seconds: number) {
    // let days = Math.floor(seconds / (3600 * 24));
    //  seconds -= days * 3600 * 24;
    let hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return `${hours}h, ${minutes}min, ${seconds}s`;
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    let failEmbed = new EmbedBuilder().setTitle(`Oops!`).setColor("Red");

    if (!interaction.isChatInputCommand()) return;

    const command: Command = this.client.commands.get(interaction.commandName)!;

    if (!command)
      return interaction.reply({
        embeds: [
          failEmbed.setDescription(`❌ This command does not seem to exist.`),
        ],
        ephemeral: true,
      });

    let userConfig = await UserConfig.findOne({ id: interaction.user.id });

    if (!userConfig) {
      userConfig = await UserConfig.create({
        id: interaction.user.id,
        dev: false,
        canBlacklist: false,
      });
      await userConfig.save();
    }

    let blacklistedUser = await BlacklistedUser.findOne({
      id: interaction.user.id,
    });

    if (!blacklistedUser) {
      blacklistedUser = await BlacklistedUser.create({
        id: interaction.user.id,
        blacklisted: false,
        reason: "None",
        moderator: "None",
      });
      await blacklistedUser.save();
    }

    if (blacklistedUser.blacklisted === true) {
      if (guild && guild.language) {
        return interaction.reply({
          embeds: [
            {
              color: 0xff6666,
              title: guild.language === "fr" ? "Oups!" : "Oops!",
              description:
                guild.language === "fr"
                  ? "❌ Vous êtes actuellement blacklist de Sentinel. Pour contester votre sanction, veuillez rejoindre notre Support."
                  : "❌ You are currently blacklisted from Sentinel. To appeal, please join our Support.",
              thumbnail: { url: this.client.user!.displayAvatarURL() },
            },
          ],
          ephemeral: true,
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 5,
                  url: "https://discord.gg/My2BVCmJEY",
                  label: "Support",
                  emoji: "💬",
                },
              ],
            },
          ],
        });
      } else {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            {
              color: 0xff6666,
              title: "Oops!",
              description: `❌ You are currently blacklisted from Sentinel. To appeal, please join our Support.`,
              thumbnail: {
                url: this.client.user?.displayAvatarURL()!,
              },
            },
          ],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 5,
                  url: "https://discord.gg/My2BVCmJEY",
                  label: "Support",
                  emoji: "💬",
                },
              ],
            },
          ],
        });
      }
    }

    if (command.premium === true) {
      const userPremiumRecord = await PremiumUser.findOne({
        "redeemedBy.id": interaction.user.id,
      });

      if (!userPremiumRecord || userPremiumRecord.expiresAt < new Date()) {
        if (userPremiumRecord) {
          await PremiumUser.deleteOne({ "redeemedBy.id": interaction.user.id });
        }

        return interaction.reply({
          embeds: [
            {
              color: 0xff6666,
              title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
              description:
                guild && guild.language === "fr"
                  ? `Cette commande est seulement pour les utilisateurs Sentinel Premium.`
                  : `This command is only for Sentinel Premium users.`,
            },
          ],
          ephemeral: true,
        });
      }
    }

    if (
      command.dev &&
      command.category === Category.Blacklist &&
      userConfig.canBlacklist === false
    ) {
      return interaction.reply({
        embeds: [
          {
            color: 0xff6666,
            title: "Oops!",
            description: `❌ You are not allowed to use this command.`,
            thumbnail: {
              url: this.client.user?.displayAvatarURL()!,
            },
          },
        ],
        ephemeral: true,
      });
    }

    if (
      command.dev &&
      command.category === Category.Staff &&
      userConfig.editPremium === false
    ) {
      return interaction.reply({
        embeds: [
          {
            color: 0xff6666,
            title: "Oops!",
            description: `❌ You are not allowed to use this command.`,
            thumbnail: {
              url: this.client.user?.displayAvatarURL()!,
            },
          },
        ],
        ephemeral: true,
      });
    }

    if (
      command.dev &&
      command.category !== Category.Blacklist &&
      command.category !== Category.Staff &&
      userConfig.dev === false
    )
      return interaction.reply({
        embeds: [
          failEmbed.setDescription(`❌ This command is only for developers.`),
        ],
        ephemeral: true,
      });

    const { cooldowns } = this.client;

    if (!cooldowns.has(command.name))
      cooldowns.set(command.name, new Collection());

    const now = Date.now();
    const timestamps = cooldowns.get(command.name)!;
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (
      timestamps.has(interaction.user.id) &&
      now < (timestamps.get(interaction.user.id) || 0) + cooldownAmount
    ) {
      const timeLeft =
        (timestamps.get(interaction.user.id) || 0) + cooldownAmount - now;
      return interaction.reply({
        embeds: [
          failEmbed.setDescription(
            `❌ Please wait another \`${this.uptimeString(
              Math.floor(timeLeft / 1000)
            )}\` to run this command.`
          ),
        ],
        ephemeral: true,
      });
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      const subCommandGroup = interaction.options.getSubcommandGroup(false);
      const subCommand = `${interaction.commandName}${
        subCommandGroup ? `.${subCommandGroup}` : ""
      }.${interaction.options.getSubcommand(false) || ""}`;

      console.log(
        `${interaction.user.username} (${interaction.user.id}) - Executed /${interaction.commandName}`
      );

      return (
        this.client.subCommands.get(subCommand)?.Execute(interaction) ||
        command.Execute(interaction)
      );
    } catch (err: any) {
      console.log(err);
      let interactionGuild = interaction.guild;
      let interactionMember = interaction.member;
      let interactionChannel = interaction.channel;
      let errorTime = `<t:${Math.floor(Date.now() / 1000)}:R>`;

      (
        (await this.client.channels.fetch("1215341642228301824")) as TextChannel
      ).send({
        embeds: [
          {
            color: 0x6666ff,
            description:
              "An error has been flagged while using a slash command. All other forms of interaction will not be flagged with this system.",
            fields: [
              {
                name: "Error Command",
                value: `\`${interaction.commandName}\``,
              },
              {
                name: "Error Stack",
                value: `\`${err.stack}\``,
              },
              {
                name: "Error Message",
                value: `\`${err.message}\``,
              },
              {
                name: "Error Timestamp",
                value: `\`${errorTime}\``,
              },
              {
                name: "Guild Name",
                value: interaction.guild
                  ? `\`${interaction.guild.name} (${interaction.guildId})\``
                  : "None",
              },
              {
                name: "Guild Channel",
                value: interaction.guild
                  ? `\`${interaction.channelId}\``
                  : "None",
              },
              {
                name: "Interaction Author",
                value: `\`${interaction.user.username} (${interaction.user.id})\``,
              },
            ],
            footer: { text: "Error Flag System" },
            timestamp: `${Date.now()}`,
          },
        ],
        content: `<@860281357014794241>`,
      });

      return interaction.reply({
        embeds: [
          {
            color: 0xff6666,
            title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
            description:
              guild && guild.language === "fr"
                ? "Une erreur est survenue lors de l'exécution de la commande. Veuillez réessayer plus tard."
                : "An error occured while executing the command. Please try again later.",
            thumbnail: {
              url: this.client.user.displayAvatarURL(),
            },
          },
        ],
      });
    }
  }
}
