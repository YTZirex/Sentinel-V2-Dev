import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import Job from "../../base/schemas/Job";
import GuildConfig from "../../base/schemas/GuildConfig";
import CommandCounter from "../../base/schemas/CommandCounter";
import Economy from "../../base/schemas/Economy";

export default class extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "work",
      description: "Allows you to work.",
      dev: false,
      cooldown: 28800,
      options: [],
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
      category: Category.Economy,
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let userId = interaction.user.id;

    let economy = await Economy.findOne({ user: userId });
    let job = await Job.findOne({ user: userId });
    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    let commandCounter = await CommandCounter.findOne({ global: 1 });

    commandCounter!.work.used += 1;
    await commandCounter?.save();

    if (!economy)
      return interaction.reply({
        embeds: [
          {
            color: 0xff6666,
            title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
            description:
              guild && guild.language === "fr"
                ? "❌ Vous devez avoir un compte bancaire pour travailler."
                : "❌ You need a bank account to work.",
          },
        ],
        ephemeral: true,
      });

    if (!job)
      return interaction.reply({
        embeds: [
          {
            color: 0xff6666,
            title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
            description:
              guild && guild.language === "fr"
                ? "❌ Vous n'avez pas d'emploi actuellement."
                : "❌ You do not have a job currently.",
          },
        ],
        ephemeral: true,
      });

    let jobs = {
      gardener: {
        salary: 20,
      },
      writer: {
        salary: 50,
      },
      artist: {
        salary: 100,
      },
      developer: {
        salary: 160,
      },
      musician: {
        salary: 220,
      },
      cook: {
        salary: 300,
      },
      detective: {
        salary: 390,
      },
      pilot: {
        salary: 500,
      },
      astronaut: {
        salary: 1000,
      },
    };

    let userJobSalary = 20;
    let userJobFrench;

    switch (job.job) {
      case "gardener":
        userJobFrench = "jardinier";
        userJobSalary = 20;
        break;
      case "writer":
        userJobFrench = "ecrivain";
        userJobSalary = 50;
        break;
      case "musician":
        userJobFrench = "musicien";
        userJobSalary = 220;
        break;
      case "artist":
        userJobFrench = "artiste";
        userJobSalary = 100;
        break;
      case "developer":
        userJobFrench = "développeur";
        userJobSalary = 160;
        break;
      case "cook":
        userJobFrench = "cuisinier";
        userJobSalary = 300;
        break;
      case "detective":
        userJobFrench = "détective";
        userJobSalary = 390;
        break;
      case "pilot":
        userJobFrench = "pilote d'avion";
        userJobSalary = 500;
        break;
      case "astronaut":
        userJobFrench = "astronaute";
        userJobSalary = 1000;
        break;
    }

    try {
      economy.balance += userJobSalary;
      await economy.save();
      return interaction.reply({
        embeds: [
          {
            color: 0x33cc99,
            description:
              guild && guild.language === "fr"
                ? `✅ Vous avez travaillé en tant que **${this.capitalizeFirstLetter(
                    userJobFrench!.toString()
                  )}** et vous avez gagné **€${userJobSalary}** !`!
                : `✅ You worked as a **${this.capitalizeFirstLetter(
                    job.job
                  )}** and gained **$${userJobSalary}** !`,
          },
        ],
      });
    } catch (err) {
      return interaction.reply({
        embeds: [
          {
            color: 0xff6666,
            title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
            description:
              guild && guild.language === "fr"
                ? "❌ Une erreur est survenue pendant l'ajout de votre salaire. Veuillez ré-essayer plus tard."
                : "❌ An error occured while adding your salary. Please try again later.",
          },
        ],
        ephemeral: true,
      });
    }
  }
  private capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
