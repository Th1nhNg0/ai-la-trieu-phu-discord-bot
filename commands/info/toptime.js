const Discord = require("discord.js");
const userModel = require(process.env.NODE_PATH + "/model/user");
module.exports = {
  name: "toptime",
  aliases: [],
  category: "info",
  description: "Get this guild top activity",
  usage: "[toptime]",
  run: async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
      .setTitle("TOP PEOPLE WHO DONT HAVE A LIFE TODAY")
      .setColor(0x333333)
      .setTimestamp()
      .setDescription("Reset every 12 am")
      .setThumbnail(message.guild.iconURL({ format: "png", size: 1024 }));

    let guildMembers = message.guild.members.cache.filter(e => !e.user.bot);
    let result = await userModel.getTopDay(guildMembers);
    for (let [id, user] of result) {
      embed.addField(user.nickname || user.user.username, user.time + " min");
    }
    message.channel.send(embed);
  }
};
