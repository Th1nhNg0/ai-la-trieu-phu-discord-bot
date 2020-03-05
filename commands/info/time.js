const Discord = require("discord.js");
const userModel = require(process.env.NODE_PATH + "/model/user");
module.exports = {
  name: "time",
  aliases: [],
  category: "info",
  description: "Get your top activity",
  usage: "[command] @user",
  run: async (client, message, args) => {
    const user = message.mentions.users.first() || message.author;
    const embed = new Discord.MessageEmbed()
      .setColor(0x333333)
      .setAuthor(user.username)
      .setTimestamp()
      .setThumbnail(user.avatarURL());
    let activities = await userModel.getAllTimeActivity(user.id);
    for (let activity of activities) {
      embed.addField(activity.name, activity.time + " min", true);
    }
    message.channel.send(embed);
  }
};
