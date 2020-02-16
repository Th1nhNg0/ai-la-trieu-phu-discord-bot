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
    const url = `https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${encodeURIComponent(
      text
    )}&lang=vi&engine=g2&key=PL3QYYuV`;
    try {
      let filePath = await downloadMp3(url);
      let dispatcher = connection.playFile(filePath, {
        type: "ogg/opus"
      });
      dispatcher.on("end", () => {
        voiceChannel.leave();
        console.log("TTS:", text);
      });
    } catch (e) {
      message.send("SORRY, SOMETHING WENT WRONG");
    }
  }
};

async function downloadMp3(url) {
  const filePath = path.join(__dirname, "a.ogg");
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream"
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve(filePath));
    writer.on("error", reject);
  });
}
