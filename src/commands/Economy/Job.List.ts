import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";
import CommandCounter from "../../base/schemas/CommandCounter";

export default class JobList extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "job.list",
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    let commandcounter = await CommandCounter.findOne({ global: 1 });
    commandcounter!.job.jobList.used += 1;
    await commandcounter?.save();
    await interaction.deferReply();

    interaction.editReply({
      embeds: [
        {
          color: 0xff6633,
          // title: guild && guild.language === "fr" ? "Métiers" : "Jobs",
          thumbnail: {
            url: this.client.user!.displayAvatarURL(),
          },
          fields: [
            {
              name: guild && guild.language === "fr" ? "Jardinier" : "Gardener",
              value:
                guild && guild.language === "fr"
                  ? "**Prix**: 0\n**Salaire**: 20"
                  : "**Price**: 0\n**Salary**: 20",
            },
            {
              name: guild && guild.language === "fr" ? "Ecrivain" : "Writer",
              value:
                guild && guild.language === "fr"
                  ? "**Prix**: 500\n**Salaire**: 50"
                  : "**Price**: 500\n**Salary**: 50",
            },
            {
              name: guild && guild.language === "fr" ? "Artiste" : "Artist",
              value:
                guild && guild.language === "fr"
                  ? "**Prix**: 1 000\n**Salaire**: 100"
                  : "**Price**: 1 000\n**Salary**: 100",
            },
            {
              name:
                guild && guild.language === "fr" ? "Développeur" : "Developer",
              value:
                guild && guild.language === "fr"
                  ? "**Prix**: 1 500\n**Salaire**: 160"
                  : "**Price**: 1 500\n**Salary**: 160",
            },
            {
              name: guild && guild.language === "fr" ? "Musicien" : "Musician",
              value:
                guild && guild.language === "fr"
                  ? "**Prix**: 2 000\n**Salaire**: 220"
                  : "**Price**: 2 000\n**Salary**: 220",
            },
            {
              name: guild && guild.language === "fr" ? "Cuisinier" : "Cook",
              value:
                guild && guild.language === "fr"
                  ? "**Prix**: 2 500\n**Salaire**: 300"
                  : "**Price**: 2 500\n**Salary**: 300",
            },
            {
              name:
                guild && guild.language === "fr" ? "Détective" : "Detective",
              value:
                guild && guild.language === "fr"
                  ? "**Prix**: 3 000\n**Salaire**: 390"
                  : "**Price**: 3 000\n**Salary**: 390",
            },
            {
              name:
                guild && guild.language === "fr" ? "Pilote d'avion" : "Pilot",
              value:
                guild && guild.language === "fr"
                  ? "**Prix**: 5 000\n**Salaire**: 500"
                  : "**Price**: 5 000\n**Salary**: 500",
            },
            {
              name:
                guild && guild.language === "fr" ? "Astronaute" : "Astronaut",
              value:
                guild && guild.language === "fr"
                  ? "**Prix**: 10 000\n**Salaire**: 1 000"
                  : "**Price**: 10 000\n**Salary**: 1 000",
            },
          ],
        },
      ],
    });
  }
}
