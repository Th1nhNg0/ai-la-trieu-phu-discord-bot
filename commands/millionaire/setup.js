const Discord = require("discord.js");
const Game = require(process.env.NODE_PATH + "/model/gameModel.js");
const questionsModel = require(process.env.NODE_PATH +
  "/model/questionsModel.js");

module.exports = {
  name: "setup",
  aliases: [],
  category: "millionaire",
  description: "Setup the game",
  //   usage: '[command]',
  run: async (client, message, args) => {
    let checkDb = await questionsModel.checkDb();
    if (!checkDb) {
      return message.channel.send("QUESTION API ERRORS,CANT PLAY NOW");
    }

    let guild = client.guilds.cache.get(message.guild.id);
    if (!guild.game || guild.game.state !== "playing") guild.game = new Game();
    let game = guild.game;

    let state = game.state;
    if (state === "playing") {
      await message.reply("ANOTHER GAME IS PLAYING!!!!");
      return;
    }

    const embed = new Discord.MessageEmbed()
      .setColor("#a3b5a5")
      .setTitle('Ai là triệu phú <(")')
      .setThumbnail(
        "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
      )
      .setDescription("✅ To Play")
      .setTimestamp()
      .setFooter(
        "Ai la trieu phu",
        "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
      )
      .addField(
        "Luật chơi",
        `Người chơi phải trả lời 15 câu hỏi với cấp độ từ dễ đến khó, thời gian suy nghĩ không hạn chế. Mỗi câu hỏi có một mức tiền thưởng, tăng dần theo thứ tự. Có ba mốc quan trọng là câu số 5, câu số 10 và câu số 15 (mốc "TRIỆU PHÚ"). Khi vượt qua các mốc này, họ chắc chắn có được số tiền thưởng tương ứng của các câu hỏi đó.

        Câu hỏi đầu tiên có 15s để trả lời, thời gian trả lời sẽ tăng thêm 1 giây qua mỗi câu hỏi.
        `
      )
      .addField("Command", 'type "confirm" if you ready!');
    const msg = await message.channel.send(embed);
    await msg.react("✅");
    const filter = m => {
      return (
        m.author.id === message.author.id &&
        m.content.toLowerCase() === "confirm"
      );
    };
    message.channel
      .awaitMessages(filter, {
        max: 1,
        time: 120000
      })
      .then(async collected => {
        let user_list = msg.reactions.cache.first().users.cache;
        let players = [];
        for (let user of user_list) {
          let userg = message.guild.member(user[1]);
          if (!user[1].bot)
            players.push({ name: userg.displayName, id: userg.id });
        }
        if (players.length === 0) {
          await message.reply("No one want to play :((");
          return;
        }
        game.init(
          players,
          client.guildSettings.get(message.guild.id).gameDatabase
        );
        const embed2 = new Discord.MessageEmbed()
          .setColor("#a3b5a5")
          .setTitle('Ai là triệu phú <(")')
          .setThumbnail(
            "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
          )
          .setTimestamp()
          .setFooter(
            "Ai la trieu phu",
            "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
          )
          .addField("Players:", players.map(e => e.name).join("\n"))
          .addField("Command:", 'Type "!start" to start the game');
        message.channel.send(embed2);
      });
  }
};
