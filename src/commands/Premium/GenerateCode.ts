import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  PermissionsBitField,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import PremiumUser from "../../base/schemas/PremiumUser";
import mongoose from "mongoose";

export default class GenerateCode extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "generate-code",
      description: `Generates a premium code.`,
      dev: true,
      premium: false,
      options: [
        {
          name: "length",
          description: `The length of the code.`,
          required: true,
          type: ApplicationCommandOptionType.String,
          choices: [
            { name: "1 day", value: "daily" },
            { name: "1 week", value: "weekly" },
            { name: "30 days ", value: "monthly" },
            { name: "365 days", value: "yearly" },
            { name: "permanent", value: "permanent" },
          ],
        },
      ],
      dm_permission: false,
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      cooldown: 3,
      category: Category.Staff,
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let codeType = interaction.options.getString("length");

    const code = Math.random().toString(36).substring(2, 8);

    const newCode = new PremiumUser({
      code,
      length: codeType,
    });
    
    try {
      await newCode.save();
      return interaction.reply({
        embeds: [
          {
            color: 0x33cc99,
            title: "Code generated !",
            description: `Your code has been generated successfully.`,
            fields: [
              {
                name: "Code:",
                value: `${code}`,
                inline: true,
              },
              {
                name: "Length:",
                value: `${codeType}`,
                inline: true,
              },
            ],
          },
        ],
        ephemeral: true,
      });
    } catch (err) {
      console.log(err);

      return interaction.reply({
        embeds: [
          {
            color: 0xff6666,
            title: "Oops!",
            description: `An error occured while generating the code.`,
          },
        ],
        ephemeral: true,
      });
    }
  }
}
