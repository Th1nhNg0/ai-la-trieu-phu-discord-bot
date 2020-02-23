const guildModel = require(process.env.NODE_PATH + "/model/guildModel.js");

module.exports = {
  name: "prefix",
  aliases: [],
  category: "moderation",
  description: "Change the prefix",
  usage: "[command || symbol]",
  run: async (client, message, args) => {
    if (args.length == 0) return message.channel.send("Please input a prefix");
    let prefix = args[0];
    let guildId = message.guild.id;
    try {
      client.guildSettings.get(guildId).prefix = prefix;
      guildModel.updatePrefix(guildId, prefix);
      message.channel.send("SUCCESS change prefix to " + prefix);
    } catch (e) {
      message.channel.send("Cant change prefix, some error happend :(");
    }
  }
};
