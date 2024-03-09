import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";
import CommandCounter from "../../base/schemas/CommandCounter";
import Job from "../../base/schemas/Job";

export default class JobDelete extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "job.delete",
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let confirm = interaction.options.getBoolean("confirm");
    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    let commandCounter = await CommandCounter.findOne({ global: 1 });
    commandCounter!.job.jobDelete.used += 1;
    await commandCounter?.save();

    if (confirm === false) {
      return interaction.reply({
        embeds: [
          {
            color: 0xff6666,
            title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
            description:
              guild && guild.language === "fr"
                ? "Pour supprimer votre compte, vous devez sélectionner **True**. Merci de comprendre que si vous supprimez votre compte, nous ne pouvons pas annuler cette action."
                : `To delete your account, you must select **True**.\nPlease understand that if you delete your account, we can't undo this action.`,
          },
        ],
      });
    }

    let job = await Job.findOne({ user: interaction.user.id });

    if (!job)
      return interaction.reply({
        embeds: [
          {
            color: 0xff6666,
            title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
            description:
              guild && guild.language === "fr"
                ? "Vous n'avez pas d'emploi actuellement."
                : "You do not have a job currently.",
          },
        ],
        ephemeral: true,
      });

    await Job.findOneAndDelete({ user: interaction.user.id }).then(async () => {
      try {
        (
          (await this.client.channels.fetch(
            "1207753909532098600"
          )) as TextChannel
        ).send({
          embeds: [
            {
              color: 0x6666ff,
              thumbnail: {
                url: interaction.user.displayAvatarURL(),
              },
              title: "Job Informations",
              fields: [
                {
                  name: "User ID:",
                  value: job!.user,
                },
                {
                  name: "Job Name:",
                  value: job!.job,
                },
              ],
            },
          ],
          content: `🗑️ A deletion procedure has been initiated on ${
            interaction.user.username
          }'s job.\n_ID: ${job!._id}.`,
        });
        return interaction.reply({
          embeds: [
            {
              color: 0x33cc99,
              title: guild && guild.language === "fr" ? "Succès!" : "Success!",
              description:
                guild && guild.language === "fr"
                  ? "Votre métier a été supprimé avec succès."
                  : "Your job has been deleted successfully.",
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
                  ? "Une erreur est survenue lors de la suppression de votre métier. Veuillez réessayer plus tard."
                  : "An error occured while deleting your job. Please try again later.",
            },
          ],
        });
      }
    });
  }
}
