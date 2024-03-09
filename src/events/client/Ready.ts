import {
  ActivityType,
  Client,
  Collection,
  Events,
  GuildMember,
  REST,
  Routes,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import colors from "colors";
import Command from "../../base/classes/Command";
import IConfig from "../../base/interfaces/IConfig";
import BlacklistedUser from "../../base/schemas/BlacklistedUser";
import { AutoPoster } from "topgg-autoposter";
import { createDjsClient } from "discordbotlist";
import { joinVoiceChannel } from "@discordjs/voice";
import Economy from "../../base/schemas/Economy";
import axios from "axios";
colors.enable();

export default class Ready extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.ClientReady,
      description: `Ready Event`,
      once: true,
    });
  }

  async Execute(client: CustomClient) {
    console.log(`✅ ${this.client.user?.tag} is now ready!`.green);

    // AutoPoster for posting server count to top.gg
    AutoPoster(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMDMwMTQyOTM1NDk3NDQxODkiLCJib3QiOnRydWUsImlhdCI6MTcwOTQ5MjM4M30.iFrSFK3gLGWcqZMjl3M9SE6os5ipn5Mixb2Y8HILd3w",
      this.client
    ).on("posted", () => {
      console.log("✅ [TOP.GG] Posted stats successfully!".green);
    });

    axios
      .post("https://api.botlist.me/api/v1/bots/1203014293549744189/stats", {
        data: {
          server_count: (await this.client.guilds.fetch()).size,
          shard_count: this.client.shard?.count || 0,
        },
        headers: {
          authorization: "IfS3DXsWcKdzH5dw_L3ZYay0-79flu",
        },
      })
      .then(() => {
        console.log(`✅ [BOTLIST.ME] Posted stats successfully!`.green);
      })
      .catch((err) => {
        console.log(`❌ [BOTLIST.ME] Failed to post stats!`.red);
      });

    const dbl = createDjsClient(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoxLCJpZCI6IjEyMDMwMTQyOTM1NDk3NDQxODkiLCJpYXQiOjE3MDk1NTI3Nzl9.3jFYKqn239B7daxQ_Ud73HeLdO75HN90YcwjcU3SDZA",
      this.client
    );

    dbl.startPosting();
    console.log(`✅ [DBL] Started posting stats!`.green);

    dbl.startPolling(/* optional interval, defaults to every five minutes */);

    dbl.on("vote", async (vote) => {
      console.log(`${vote.username}#${vote.discriminator} voted!`);
      let economy = await Economy.findOne({
        user: vote.id,
      });

      if (economy) {
        try {
          economy.balance += 500;
          await economy.save();
          (
            (await this.client.channels.fetch(
              "1213882820708007966"
            )) as TextChannel
          ).send({
            embeds: [
              {
                title: `${vote.username}#${vote.discriminator} voted!\nI added **€500** to their account !`,
                color: 0x33cc99,
              },
            ],
          });
        } catch (err) {
          (
            (await this.client.channels.fetch(
              "1213882820708007966"
            )) as TextChannel
          ).send({
            embeds: [
              {
                title: `${vote.username}#${vote.discriminator} voted!`,
                color: 0x33cc99,
              },
            ],
          });
        }
      } else {
        (
          (await this.client.channels.fetch(
            "1213882820708007966"
          )) as TextChannel
        ).send({
          embeds: [
            {
              title: `${vote.username}#${vote.discriminator} voted!`,
              color: 0x33cc99,
              thumbnail: {
                url: vote.avatar || this.client.user.displayAvatarURL(),
              },
            },
          ],
        });
      }
    });

    // dbl.startPolling(/* optional interval, defaults to every five minutes */);
    /*
    dbl.on("vote", async (vote) => {
      console.log(`${vote.username}#${vote.discriminator} voted!`);
      ((await this.client.channels.fetch("1213882820708007966")) as TextChannel)
        .send({
          embeds: [
            {
              title: "New vote received!",
              color: 0x33cc99,
              description: `I have been voted by <@${vote.username}> on [DiscordBotList](https://discord.ly/sentinel-v2)! Thank you for your support!`,
              thumbnail: {
                url: vote.avatar!,
              },
            },
          ],
        })
        .then((x) => x.crosspost())
        .then((x) => x.react("🎉"));
    });*/

    /*
    const app = express();

    // Define your express routes
    app.get("/", (req, res) => {
      const clientIp = req.ip;
      res.send(`Your IP address is: ${clientIp}`);
    });

    // Create a Top.gg Webhook instance with your webhook authorization
    const wh = new Webhook("irizlebest");

    // Listen to the '/dblwebhook' endpoint for vote events
    app.post(
      "/dblwebhook",
      wh.listener((vote) => {
        // Handle the vote event here
        console.log("New vote received from:", vote.user);

        // Fetch the text channel where you want to send the notification
        const channel = this.client.channels.cache.get(
          "1213882820708007966"
        ) as TextChannel;

        // Send a notification about the new vote
        channel
          .send({
            embeds: [
              {
                title: "New vote received!",
                color: 0x33cc99,
                description: `I have been voted by <@${vote.user}> on Top.gg! Thank you for your support!`,
              },
            ],
          })
          .then((x) => x.crosspost())
          .then((x) => x.react("🎉"));
      })
    );

    // Start listening on port 80
    app.listen(80);
    console.log("✅ [EXPRESS] Listening on port 80.");*/

    // Your command registration logic and other functionalities can follow here...

    const clientId = this.client.developmentMode
      ? this.client.config.devClientId
      : this.client.config.clientId;
    const rest = new REST().setToken(this.client.config.token);
    const devCommands: any = await rest.put(
      Routes.applicationGuildCommands(clientId, this.client.config.devGuildId),
      {
        body: this.GetJson(
          this.client.commands.filter((command) => command.dev)
        ),
      }
    );
    console.log(
      `✅ Successfully registered ${devCommands.length} dev commands!`.green
    );

    if (!this.client.developmentMode) {
      const globalCommands: any = await rest.put(
        Routes.applicationCommands(clientId),
        {
          body: this.GetJson(
            this.client.commands.filter((command) => !command.dev)
          ),
        }
      );
      console.log(
        `✅ Successfully registered ${globalCommands.length} global commands!`
          .green
      );

      console.log(
        `✅ Successfully registered ${this.client.subCommands.size} sub commands!`
          .green
      );

      console.log(
        `✅ ${
          this.client.subCommands.size + this.client.commands.size
        } commands loaded !`.green
      );

      const connection = joinVoiceChannel({
        guildId: "1031586420575457341",
        channelId: "1215739413011632168",
        adapterCreator: this.client.guilds.cache.get("1031586420575457341")!
          .voiceAdapterCreator,
      });

      let guildsFetchedSize = (await this.client.guilds.fetch()).size;
      setInterval(async () => {
        (
          (await this.client.channels.fetch(
            "1214288643351384074"
          )) as TextChannel
        ).setName(
          `📈 ${this.separateNumbers(
            this.client.guilds.cache
              .map((guild) => guild.memberCount)
              .reduce((a, b) => a + b, 0)
          )} users!`,
          "Refreshed Users"
        );
        (
          (await this.client.channels.fetch(
            "1215260641003044874"
          )) as TextChannel
        ).setName(
          `📜 ${this.separateNumbers(guildsFetchedSize)} servers!`,
          "Refreshed Servers"
        );

        (
          (await this.client.channels.fetch(
            "1214285990689247233"
          )) as TextChannel
        ).setName(
          `🚀${this.separateNumbers(
            this.client.guilds.cache
              .map((guild) => guild.memberCount)
              .reduce((a, b) => a + b, 0)
          )} / ${this.separateNumbers(
            this.getNextMemberMilestone(
              this.client.guilds.cache
                .map((guild) => guild.memberCount)
                .reduce((a, b) => a + b, 0)
            )
          )} users!`,
          "Refreshed Users Goal"
        );

        (
          (await this.client.channels.fetch(
            "1216090409630171207"
          )) as TextChannel
        ).setName(
          `🚀${this.separateNumbers(
            guildsFetchedSize
          )} / ${this.separateNumbers(
            this.getNextGuildsMilestone(guildsFetchedSize)
          )} servers!`,
          "Refreshed Servers Goal"
        );
      }, 300000);
      // Our pointer
      let i = 0;
      // Every 15 seconds, update the status
      setInterval(() => {
        let statuses = [
          `${this.separateNumbers(
            this.client.guilds.cache
              .map((guild) => guild.memberCount)
              .reduce((a, b) => a + b, 0)
          )} users!`,
          `Version ${this.client.config.botVersion}`,
          `Released 10/02/2024 10:00PM !`,
          `${this.separateNumbers(guildsFetchedSize)} servers!`,
          `Online since ${this.uptimeString(Math.floor(process.uptime()))}`,
        ];

        // Get the status
        let status = statuses[i];
        // If it's undefined, it means we reached the end of the array
        if (!status) {
          // Restart at the first status
          status = statuses[0];
          i = 0;
        }
        client.user?.setPresence({
          activities: [{ name: status, type: ActivityType.Watching }],
          status: "online",
        });
        i++;
      }, 5000);
      let blacklistUsersKicked = 0;
    }
  }
  private GetJson(commands: Collection<string, Command>): object[] {
    const data: object[] = [];

    commands.forEach((command) => {
      data.push({
        name: command.name,
        description: command.description,
        options: command.options,
        default_member_permissions:
          command.default_member_permissions.toString(),
        dm_permission: command.dm_permission,
      });
    });
    return data;
  }
  private uptimeString(seconds: number) {
    // eslint-disable-next-line prefer-const
    let days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    // eslint-disable-next-line prefer-const
    let hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    // eslint-disable-next-line prefer-const
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return `${days}d, ${hours}h, ${minutes}min, ${seconds}s`;
  }

  private getAllCommands() {
    const commands = [];
    for (const [command] of this.client.commands) {
      commands.push({
        name: this.client.commands.get(`${command}`)!.name,
        description: this.client.commands.get(`${command}`)!.description,
      });
    }
    return commands;
  }

  private getNextMemberMilestone(currentMembers: number) {
    let milestone;
    if (currentMembers < 100) {
      milestone = Math.ceil(currentMembers / 25) * 25;
    } else if (currentMembers >= 100 && currentMembers < 1000) {
      milestone = Math.ceil(currentMembers / 100) * 100;
    } else {
      milestone = Math.ceil(currentMembers / 250) * 250;
    }
    // If the current member count equals the milestone, calculate the next milestone
    if (currentMembers === milestone) {
      if (currentMembers < 100) {
        milestone += 25;
      } else if (currentMembers >= 100 && currentMembers < 1000) {
        milestone += 100;
      } else {
        milestone += 250;
      }
    }
    return milestone;
  }

  private getNextGuildsMilestone(currentGuilds: number) {
    let milestone;
    if (currentGuilds < 50) {
      milestone = Math.ceil(currentGuilds / 10) * 10;
    } else if (currentGuilds >= 50 && currentGuilds < 100) {
      milestone = Math.ceil(currentGuilds / 25) * 25;
    } else {
      milestone = Math.ceil(currentGuilds / 100) * 100;
    }
    return milestone;
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
