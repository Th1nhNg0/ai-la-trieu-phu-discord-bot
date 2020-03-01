const Discord = require("discord.js");
const questionsModel = require(process.env.NODE_PATH +
  "/model/questionsModel.js");
const guildModel = require(process.env.NODE_PATH + "/model/guildModel.js");

module.exports = {
  name: "config",
  category: "moderation",
  description: "config of the server",
  usage: "\nconfig\n config set [name] [value may (be nothing)]",
  //   usage: '[command]',
  run: async (client, message, args) => {
    let guild = client.guildSettings.get(message.guild.id);
    let category = await questionsModel.getCategory();
    let embed = new Discord.MessageEmbed().setTitle("Category question:");
    for (let cate of category) {
      embed.addField(`**${cate.name}**`, `ID: ${cate.id}`, true);
    }
    message.channel.send(embed);
    let prefix = guild.prefix;
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
    }
  }
};
