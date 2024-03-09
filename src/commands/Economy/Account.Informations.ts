import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import Economy from "../../base/schemas/Economy";
import GuildConfig from "../../base/schemas/GuildConfig";
import CommandCounter from "../../base/schemas/CommandCounter";

export default class AccountInformations extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "account.informations",
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let economy = await Economy.findOne({ user: interaction.user.id });
    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    let commandcounter = await CommandCounter.findOne({ global: 1 });
    commandcounter!.account.accountInformations.used += 1;
    await commandcounter!.save();

    await interaction.deferReply({ ephemeral: true });

    if (!economy)
      return interaction.editReply({
        embeds: [
          {
            title: guild && guild.language === "fr" ? "Oups!" : "Oops!",
            description:
              guild && guild.language === "fr"
                ? "❌ Vous n'avez pas encore créé de compte bancaire."
                : "❌ You have not created your bank account yet.",
          },
        ],
      });
    let fetchedMember = await interaction.user.fetch();
    interaction.editReply({
      embeds: [
        {
          color: 0xff6633,
          title:
            guild && guild.language === "fr"
              ? "Mes Informations"
              : "My Informations",
          thumbnail: {
            url: (await fetchedMember).displayAvatarURL({ size: 64 }),
          },
          fields: [
            {
              name:
                guild && guild.language ? "👤 **Noms:**" : "👤 **Fullname:**",
              value: `${economy.names}`,
            },
            {
              name: "\u200a",
              value: "\u200a",
            },
            {
              name:
                guild && guild.language === "fr"
                  ? "👶 **Date de naissance:**"
                  : "👶 **Date Of Birth:**",
              value: `${economy.dateOfBirth}`,
            },
            {
              name: "\u200a",
              value: "\u200a",
            },
            {
              name:
                guild && guild.language === "fr"
                  ? "👤 **Sexe:**"
                  : "👤 **Gender:**",
              value:
                guild && guild.language === "fr"
                  ? `${economy.gender === "male" ? "Mâle" : "Femelle"}`
                  : `${economy.gender === "male" ? "Male" : "Female"}`,
            },
            {
              name: "\u200a",
              value: "\u200a",
            },
            {
              name:
                guild && guild.language === "fr"
                  ? "🏦 **Banque:**"
                  : "🏦 **Bank: **",
              value: "Sentinel Finance",
            },
            {
              name: "\u200a",
              value: "\u200a",
            },
            {
              name:
                guild && guild.language === "fr"
                  ? "💸 **Montant:**"
                  : "💸 **Amount: **",
              value:
                guild && guild.language === "fr"
                  ? `€ ${this.separateNumbers(economy.balance)}`
                  : `$ ${this.separateNumbers(economy.balance)}`,
            },
            {
              name: "\u200a",
              value: "\u200a",
            },
            {
              name:
                guild && guild.language === "fr"
                  ? "💳 **Numéro:**"
                  : "💳 **Number:**",
              value: `${economy.creditCardNumber}`,
            },
            {
              name: "\u200a",
              value: "\u200a",
            },
            {
              name:
                guild && guild.language === "fr"
                  ? "💳 **Cryptogramme:**"
                  : "💳 **Cryptogram:**",
              value: `${economy.cvc}`,
            },
            {
              name: "\u200a",
              value: "\u200a",
            },
            {
              name:
                guild && guild.language === "fr"
                  ? "💳** Expire:**"
                  : "💳** Expires:**",
              value: "11/27",
            },
          ],
        },
      ],
    });
  }
  private separateNumbers(number: any) {
    // Convert the number to a string
    let numberString = number.toString();

    // Split the string into groups of three digits from the end
    let separatedNumber = [];
    let group = "";
    for (let i = numberString.length - 1; i >= 0; i--) {
      group = numberString[i] + group;
      if (group.length === 3 || i === 0) {
        separatedNumber.unshift(group);
        group = "";
      }
    }

    // Join the groups with spaces
    return separatedNumber.join(" ");
  }
}
