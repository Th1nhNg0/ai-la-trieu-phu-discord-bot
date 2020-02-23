const Discord = require("discord.js");
const questionsModel = require("./questionsModel.js");
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Game {
  async init(players) {
    if (players.length > 0) this.state = "init";
    this.currentQuestion = 1;
    this.players = new Discord.Collection();
    for (let player of players) {
      this.players.set(player.id, {
        name: player.name,
        alive: true,
        currentQuestion: 1,
        id: player.id
      });
    }
    this.questions = await questionsModel.getQuestions();
  }
  getTopPlayer() {
    this.players.sort((a, b) => b.currentQuestion - a.currentQuestion);
    return this.players;
  }
  getAlivePlayer() {
    return this.players.filter(elem => elem.alive).array();
  }
  async play(voiceChannel, message) {
    let connection = await voiceChannel.join();
    this.state = "playing";
    let questions = this.questions;
    let players = this.players;
    let dispatcher;
    await playSync(connection, "./music/start.ogg");

    for (let i = 1; i <= 15; i++) {
      if (this.state === "end") {
        dispatcher = connection.playFile("./music/end.ogg", {
          type: "ogg/opus"
        });
        let embed = getEndEmbed(this.getTopPlayer());
        message.channel.send(embed);
        return dispatcher.on("end", function() {
          voiceChannel.leave();
        });
      }
      dispatcher = connection.playFile("./music/" + getMusic(i, ""), {
        type: "ogg/opus"
      });
      const msg = await message.channel.send(`:computer: LOADING QUESTION....`);
      try {
        await msg.react("🇦");
        await msg.react("🇧");
        await msg.react("🇨");
        await msg.react("🇩");
      } catch (err) {
        console.log("One of the emojis failed to react.");
      }

      let question = questions[i - 1];
      let answer = question.answer;
      await msg.edit(
        new Discord.RichEmbed()
          .setColor("#53b512")
          .setTitle("Câu hỏi số " + i)
          .setTimestamp()
          .setFooter(
            "Ai la trieu phu",
            "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
          )
          .setDescription(question.question)
          .addField("Đáp án 🇦", question.A, true)
          .addField("Đáp án 🇧", question.B, true)
          .addBlankField()
          .addField("Đáp án 🇨", question.C, true)
          .addField("Đáp án 🇩", question.D, true)
      );

      let interval;
      let time = getTime(i) / 1000 - 1;
      let cd = await message.channel.send(`Time left: ${time} seconds`);

      interval = setInterval(function() {
        cd.edit(`Time left: ${time} seconds`);
        time--;
        if (time < 0) {
          cd.delete();
          clearInterval(interval);
        }
      }, 1000);

      players.forEach(function(player) {
        player.voted = null;
      });

      const filter = (reaction, user) => {
        let player = players.get(user.id);
        if (user.bot || (player && player.voted && player.alive)) return false;
        if (!["🇦", "🇧", "🇨", "🇩"].includes(reaction.emoji.name))
          return false;
        player.voted = reaction.emoji.name;
        message.channel.send(user + " " + reaction.emoji.name);
        return true;
      };
      await msg
        .awaitReactions(filter, { time: getTime(i) })
        .then(async collected => {
          let correctAnswer = 0;
          let wrongAnswer = 0;
          players.forEach(function(player) {
            let userAnswer = player.voted;
            player.currentQuestion = i;
            switch (userAnswer) {
              case "🇦":
                userAnswer = "A";
                break;
              case "🇧":
                userAnswer = "B";
                break;
              case "🇨":
                userAnswer = "C";
                break;
              case "🇩":
                userAnswer = "D";
                break;
              default:
                userAnswer = null;
            }
            if (userAnswer != answer) {
              player.alive = false;
              wrongAnswer++;
            } else correctAnswer++;
          });
          let alivePlayer = this.getAlivePlayer();
          if (alivePlayer.length === 0) this.state = "end";
          let fileName;
          if (correctAnswer >= wrongAnswer) fileName = getMusic(i, "dung");
          else fileName = getMusic(i, "sai");
          await playSync(connection, "./music/" + fileName);
          let embed = getAnswerEmbed(answer);
          await message.channel.send(embed);
          await message.channel.send(
            new Discord.RichEmbed()
              .setColor("#0099ff")
              .setTitle("Người chơi tiếp: " + alivePlayer.length)
              .setTimestamp()
              .setFooter(
                "Ai la trieu phu",
                "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
              )
              .addField(
                "Danh sách",
                alivePlayer.length > 0
                  ? alivePlayer.map(e => e.name).join("\n")
                  : "Đéo có ai :'("
              )
          );
          await sleep(4000);
        });
    }
  }
}
module.exports = Game;

function getMusic(i, state) {
  switch (true) {
    case i <= 5:
      return "1-5" + state + ".ogg";
    default:
      return i + state + ".ogg";
  }
}
function getTime(i) {
  switch (true) {
    case i <= 5:
      return 15000;
    case i <= 10:
      return 20000 + i * 1000;
    case i <= 15:
      return 45000 + i * 1000;
    default:
      return 15000;
  }
}
function getAnswerEmbed(answer) {
  const imgFile = new Discord.Attachment("./image/" + answer + ".png");
  return new Discord.RichEmbed()
    .setColor("#a3ff99")
    .setTitle("Câu trả lời của chúng tôi là")
    .setTimestamp()
    .setFooter(
      "Ai la trieu phu",
      "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
    )
    .attachFile(imgFile)
    .setImage("attachment://" + answer + ".png");
}
function getEndEmbed(playerList) {
  playerList = [...playerList.values()];
  playerList[0].name = " :first_place: " + playerList[0].name;
  if (playerList.length > 1)
    playerList[1].name = " :second_place: " + playerList[1].name;
  if (playerList.length > 2)
    playerList[2].name = " :third_place: " + playerList[2].name;
  playerList = playerList.map(
    (elem, index) =>
      (index < 3 ? "**" + elem.name + "**" : index + 1 + " " + elem.name) +
      " " +
      elem.currentQuestion
  );
  return new Discord.RichEmbed()
    .setColor("#dbdb2c")
    .setTitle("END GAME")
    .setTimestamp()
    .setFooter(
      "Ai la trieu phu",
      "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
    )
    .addField("Rank: ", playerList.join(" \n "));
}
async function playSync(voiceConnection, filepath) {
  const player = voiceConnection.playFile(filepath, {
    type: "ogg/opus"
  });
  await new Promise(resolve => player.on("end", resolve));
}
