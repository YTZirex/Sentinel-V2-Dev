import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  PermissionsBitField,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import PremiumUser from "../../base/schemas/PremiumUser";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class ClaimPremium extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "claim-premium",
      description: `Claim a premium account using a given code.`,
      dm_permission: false,
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      dev: true,
      premium: false,
      cooldown: 3,
      category: Category.Premium,
      options: [
        {
          name: "code",
          description: "The code to redeem.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    const codeValue = interaction.options.getString("code");
    const userId = interaction.user.id;

    let guild = await GuildConfig.findOne({ id: interaction.guildId });

    try {
      const code = await PremiumUser.findOne({ code: codeValue });

      if (!code) {
        return interaction.reply({
          embeds: [
            {
              title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
              description:
                guild && guild.language === "fr"
                  ? `Ce code est invalide. Veuillez réessayer.`
                  : `This code is invalid. Please try again.`,
              color: 0xff6666,
            },
          ],
          ephemeral: true,
        });
      }

      if (code.redeemedBy && code.redeemedBy.id) {
        return interaction.reply({
          embeds: [
            {
              title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
              color: 0xff6666,
              description:
                guild && guild.language === "fr"
                  ? `Ce code a déjà été utilisé.`
                  : "This code has already been used.",
            },
          ],
          ephemeral: true,
        });
      }

      const existingCode = await PremiumUser.findOne({
        "redeemedBy.id": userId,
      });

      if (existingCode) {
        return interaction.reply({
          embeds: [
            {
              color: 0xff6666,
              title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
              description:
                guild && guild.language === "fr"
                  ? "Vous avez déjà un abonnement en cours."
                  : "You currently have a subscription.",
            },
          ],
          ephemeral: true,
        });
      }

      const codeExpiration = new Date();
      const codeLength = code.length;

      const expirationLenghts: any = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365,
        "14 days": 14,
        "30 days": 30,
        "60 days": 60,
        "90 days": 90,
        permanent: 1826250,
      };

      const expirationLength =
        expirationLenghts[codeLength] || parseInt(codeLength);

      if (isNaN(expirationLength)) {
        return interaction.reply({
          embeds: [
            {
              color: 0xff6666,
              title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
              description:
                guild && guild.language === "fr"
                  ? `Ce code a une durée invalide.`
                  : "This code has an invalid length.",
            },
          ],
          ephemeral: true,
        });
      }

      codeExpiration.setDate(codeExpiration.getDate() + expirationLength);

      const redeemedUser = {
        id: interaction.user.id,
        username: interaction.user.username,
      };

      const redeemedOn = new Date();

      await PremiumUser.updateOne(
        {
          code: codeValue,
        },
        {
          $set: {
            redeemedBy: redeemedUser,
            redeemedOn: redeemedOn,
            expiresAt: codeExpiration,
          },
        }
      );

      return interaction.reply({
        embeds: [
          {
            color: 0x33cc99,
            title: guild && guild.language === "fr" ? "Succès!" : "Success!",
            description:
              guild && guild.language === "fr"
                ? `Ce code a été utilisé avec succès. Bienvenue chez Sentinel Premium!`
                : `This code was used successfully. Welcome to Sentinel Premium!`,
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
            title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
            description:
              guild && guild.language === "fr"
                ? `Une erreur est survenue pendant l'utilisation du code. Veuillez réessayer.`
                : `An error occured while using the code. Please try again.`,
          },
        ],
      });
    }
  }
}
