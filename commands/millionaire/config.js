const Discord = require("discord.js");
const questionsModel = require(process.env.NODE_PATH +
  "/model/questionsModel.js");
const guildModel = require(process.env.NODE_PATH + "/model/guildModel.js");

module.exports = {
  name: "config",
  category: "millionaire",
  description: "config of the server",
  usage: "\nconfig\n config set [name] [value may (be nothing)]",
  //   usage: '[command]',
  run: async (client, message, args) => {
    let guild = client.guildSettings.get(message.guild.id);
    let database = guild.gameDatabase;
    let questionCount = await questionsModel.countQuestions(database);
    if (!database) database = "DEFAULT";
    else database = "GUILD'S DATABASE";
    let prefix = guild.prefix;
    if (args.length == 0) {
      message.channel.send(JSON.stringify({ database, questionCount, prefix }));
    }
    if (args[0] == "set") {
      args.shift();
      if (args.length == 0)
        return message.channel.send("PLEASE INPUT config you want to change");

      if (args[0] == "prefix") {
        args.shift();
        if (args.length == 0)
          return message.channel.send("Please input a prefix");
        let prefix = args[0];
        let guildId = guild.id;
        try {
          guild.prefix = prefix;
          await guildModel.updatePrefix(guildId, prefix);
          message.channel.send("SUCCESS change prefix to " + prefix);
        } catch (e) {
          message.channel.send("Cant change prefix, some error happend :(");
        }
      }
      if (args[0] == "database") {
        try {
          if (guild.gameDatabase) {
            guild.gameDatabase = undefined;
            guildModel.updateDatabase(guild.id, undefined);
          } else {
            guild.gameDatabase = guild.id;
            guildModel.updateDatabase(guild.id, guild.id);
          }
          message.channel.send(
            "Database set to " +
              (guild.gameDatabase ? "GUILD'S DATABASE" : "DEFAULT")
          );
        } catch (e) {
          message.channel.send("SOME ERROR AND I CANT SAVE :)");
        }
      }
    }
  }
};
