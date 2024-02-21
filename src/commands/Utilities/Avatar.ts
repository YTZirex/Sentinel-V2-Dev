import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionsBitField,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";
import CommandCounter from "../../base/schemas/CommandCounter";

export default class Avatar extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "avatar",
      description: `Get the avatar of a user.`,
      dev: false,
      cooldown: 3,
      category: Category.Utilities,
      dm_permission: false,
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      options: [
        {
          name: "target",
          required: false,
          description: `The target to display`,
          type: ApplicationCommandOptionType.User,
        },
      ],
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    let commandCounter = await CommandCounter.findOne({ global: 1 });

    commandCounter!.avatar.used += 1;
    await commandCounter?.save();

    let target = interaction.options.getUser("target") ||
      interaction.user

    await interaction.deferReply();

    let fetchedMember = await target.fetch();

    interaction.editReply({
      embeds: [
        {
          color: 0xff6633,
          title: `${fetchedMember.tag}`,
          url: target.displayAvatarURL(),
          image: {
            url: target.displayAvatarURL({ size: 4096 }),
          },
        },
      ],
    });
  }
}
