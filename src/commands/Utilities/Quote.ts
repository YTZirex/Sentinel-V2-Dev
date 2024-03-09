import axios from "axios";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  PermissionsBitField,
} from "discord.js";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";
import { Language, TranslationParameters, translate } from "deepl-client";
import CommandCounter from "../../base/schemas/CommandCounter";

export default class Quotes extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "quote",
      description: "Get a random quote",
      cooldown: 600,
      dev: false,
      premium: false,
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
      options: [
        {
          name: "category",
          description: `Select the category of the quote.`,
          required: true,
          type: ApplicationCommandOptionType.String,
          choices: [
            { name: "Age", value: "age" },
            { name: "Art", value: "art" },
            { name: "Business", value: "business" },
            { name: "Change", value: "change" },
            { name: "Communication", value: "communication" },
            { name: "Design", value: "design" },
            { name: "Dreams", value: "dreams" },
            { name: "Education", value: "education" },
            { name: "Environmental", value: "environmental" },
            { name: "Family", value: "family" },
            { name: "Fitness", value: "fitness" },
            { name: "Food", value: "food" },
            { name: "Friendship", value: "friendship" },
            { name: "Health", value: "health" },
            { name: "History", value: "history" },
            { name: "Hope", value: "hope" },
            { name: "Humor", value: "humor" },
            { name: "Inspirational", value: "inspirational" },
            { name: "Knowledge", value: "knowledge" },
            { name: "Leadership", value: "leadership" },
            { name: "Learning", value: "learning" },
            { name: "Life", value: "life" },
            { name: "Love", value: "love" },
            { name: "Money", value: "money" },
            { name: "Success", value: "success" },
          ],
        },
      ],
      category: Category.Utilities,
    });
  }
  async Execute(interaction: ChatInputCommandInteraction) {
    let commandCounter = await CommandCounter.findOne({ global: 1 });

    commandCounter!.quote.used += 1;
    await commandCounter?.save();

    const category = interaction.options.getString("category")!;
    await interaction.deferReply();
    const quoteData = await this.fetchInspirationalQuote(category);
    let guild = await GuildConfig.findOne({ id: interaction.guildId });
    if (quoteData) {
      if (guild && guild.language === "fr") {
        try {
          let translation: any;

          const translationResponse = await translate({
            auth_key: "01be6c49-b75d-4c6f-b0e7-1cb6c8ddc8bd:fx",
            text: quoteData.quote, // The text to be translated
            target_lang: Language.French, // Translate to French
          });

          // Extract the translated text from the response
          const translatedText = translationResponse.translations[0].text;

          return interaction.editReply({
            embeds: [
              {
                color: 0x6666ff,
                description: `${translatedText}`,
                footer: {
                  text: `Citation écrite par ${quoteData.author}.`,
                },
              },
            ],
          });
        } catch (err) {
          return interaction.editReply({
            embeds: [
              {
                color: 0xff6666,
                title: "Oups!",
                description: `Une erreur est survenue pendant la traduction de la citation. Veuillez réessayer plus tard.`,
              },
            ],
          });
        }
      } else {
        return interaction.editReply({
          embeds: [
            {
              color: 0x6666ff,
              description: quoteData.quote,
              footer: {
                text: `Quote written by ${quoteData.author}.`,
              },
            },
          ],
        });
      }
    } else {
      console.log(
        "Failed to fetch an inspirational quote. Please try again later."
      );
    }
  }
  private async fetchInspirationalQuote(category: string) {
    try {
      const response = await axios.get(
        `https://api.api-ninjas.com/v1/quotes?category=${category}`,
        {
          headers: {
            "X-Api-Key": "JUDcDsQVPQCsYyMiRRCsig==x86Hvi9twNm8v8iz",
          },
        }
      );
      const quote = response.data[0].quote;
      const author = response.data[0].author;
      return { quote, author };
    } catch (error: any) {
      console.error("Error fetching inspirational quote:", error.message);
      return null;
    }
  }
}
