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
      .setTitle(user.username)
      .setTimestamp()
      .setThumbnail(user.avatarURL());
    let activities = await userModel.getAllTimeActivity(user.id);
    sum = activities.reduce((pl, cur) => pl + cur.time, 0);
    embed.addField("TOTAL:", convertTime(sum));
    for (let activity of activities) {
      embed.addField(activity.name, activity.time + " min", true);
    }
    message.channel.send(embed);
  },
};

function convertTime(minutes) {
  day = ~~(minutes / (60 * 24));
  minutes %= 60 * 24;
  hour = ~~(minutes / 60);
  minutes %= 60;
  str = "";
  str += day > 0 ? day + " day " : "";
  str += hour > 0 ? hour + " hour " : "";
  str += minutes > 0 ? minutes + " minutes " : "";
  return str;
}
