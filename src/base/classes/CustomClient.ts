import { Client, Collection, GatewayIntentBits } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import IConfig from "../interfaces/IConfig";
import Handler from "./Handler";
import Command from "./Command";
import SubCommand from "./SubCommand";
import mongoose, { connect } from "mongoose";

export default class CustomClient extends Client implements ICustomClient {
  handler: Handler;
  config: IConfig;
  commands: Collection<string, Command>;
  subCommands: Collection<string, SubCommand>;
  cooldowns: Collection<string, Collection<string, number>>;
  developmentMode: boolean;
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
      ],
    });

    this.config = require(`${process.cwd()}/data/config.json`);
    this.handler = new Handler(this);
    this.commands = new Collection();
    this.subCommands = new Collection();
    this.cooldowns = new Collection();
    this.developmentMode = process.argv.slice(2).includes("--development");
  }

  Init(): void {
    console.log(
      `Initializing in ${
        this.developmentMode ? "development" : "production"
      } mode.`
    );
    this.LoadHandlers();

    this.login(
      this.developmentMode ? this.config.devToken : this.config.token
    ).catch((err) => console.error(err));

    connect(
      this.developmentMode ? this.config.devMongoURI : this.config.mongoURI
    )
      .then(() =>
        console.log(
          `✅ [DB] Connected in ${
            this.developmentMode ? "development" : "production"
          } mode.`.green
        )
      )
      .then(() =>
        mongoose.connection.db
          .admin()
          .command({ ping: 1 })
          .then(() =>
            console.log(
              `✅ [DB] Pinged deployment. Successfully connected to MongoDB.`
                .green
            )
          )
      );
  }

  LoadHandlers(): void {
    this.handler.LoadEvents();
    this.handler.LoadCommands();
  }
}
