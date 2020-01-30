const Discord = require("discord.js");

module.exports = {
  name: "start",
  aliases: [],
  category: "millionaire",
  description: "Start the game",
  run: async (client, message, args) => {
    let guild = client.guilds.get(message.guild.id);
    let game = guild.game;
    if (!game || game.state === "playing")
      return message.reply("ANOTHER GAME IS PLAYING!!!!");
    if (game.state !== "init") return message.reply("The game not setup yet");
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel)
      return message.channel.send("You need to be in a voice channel to play!");
    game.play(voiceChannel, message);
  }
};
