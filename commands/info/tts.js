const fs = require("fs");
const path = require("path");
const axios = require("axios");
module.exports = {
  name: "tts",
  aliases: [],
  category: "info",
  description: "Text to speech :)",
  usage: "[command] [text]",
  run: async (client, message, args) => {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel)
      return message.channel.send("You need to be in a voice channel to play!");
    if (message.guild.voiceConnection) {
      return message.channel.send(`${message.member} Im currently busy!`);
    }
    let connection = await voiceChannel.join();
    let text = args.join(" ");
    if (text.length == 0) return;
    const url = `https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${encodeURIComponent(
      text
    )}&lang=vi&engine=g2&key=PL3QYYuV`;
    message.channel.send(url);
    try {
      let dispatcher = connection.playArbitraryInput(url);
      dispatcher.on("end", () => {
        console.log("TTS:", text);
        voiceChannel.leave();
      });
    } catch (e) {
      message.channel.send("SORRY, SOMETHING WENT WRONG\n" + e);
      voiceChannel.leave();
    }
  }
};
