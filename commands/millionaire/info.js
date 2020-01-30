const Discord = require("discord.js");
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = {
  name: "info",
  aliases: [],
  category: "millionaire",
  description: "Info of this game",
  //   usage: '[command]',
  run: async (client, message, args) => {
    let guild = client.guilds.get(message.guild.id);
    let game = guild.game;
    let state = game ? game.state : null;
    if (state == null) {
      message.reply("game not setup yet");
      return;
    }
    let currentQuestion = game.currentQuestion;
    let playersList = game
      .getTopPlayer()
      .map(e => `${e.name} ${e.alive ? "✅" : ":x:"}   ${e.currentQuestion}`);
    await message.channel.send(
      new Discord.RichEmbed()
        .setColor("#28f7dc")
        .setTitle("Thông tin")
        .setTimestamp()
        .setFooter(
          "Ai la trieu phu",
          "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
        )
        .addField("Câu hỏi hiện tại:", currentQuestion)
        .addField("Danh sách người chơi:", playersList)
    );
  }
};
