const Discord = require("discord.js");
const questionsModel = require(process.env.NODE_PATH +
  "/model/questionsModel.js");

module.exports = {
  name: "addq",
  aliases: [],
  category: "millionaire",
  description: "Add question to guild's database",
  usage: "[command]",
  run: async (client, message, args) => {
    let i = 0;
    let ask = [
      "Enter your question:",
      "Answer A:",
      "Answer B:",
      "Answer C:",
      "Answer D:",
      "Right Answer A/B/C/D ?",
      "Ok now im check your question"
    ];
    let data = [];
    message.channel.send(ask[i]);
    i++;
    function filter(msg) {
      if (msg.author == message.author) {
        message.channel.send(ask[i]);
        data.push(msg.content);
        i++;
        return true;
      }
      return false;
    }
    let messCollect = new Discord.MessageCollector(message.channel, filter, {
      maxMatches: 6
    });
    messCollect.on("end", async function() {
      if (
        data[5] != "A" &&
        data[5] != "B" &&
        data[5] != "C" &&
        data[5] != "D"
      ) {
        return message.channel.send("Your answer must be A,B,C or D");
      }

      let question = {
        question: data[0],
        A: data[1],
        B: data[2],
        C: data[3],
        D: data[4],
        answer: data[5],
        guildId: message.guild.id
      };
      await message.channel.send(
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
          .addField("Đáp án đúng", question.answer)
      );
      await message.channel.send("Is this right? Y/n");
      let okCheck = new Discord.MessageCollector(
        message.channel,
        msg =>
          msg.author == message.author &&
          (msg.content.toLowerCase() == "y" ||
            msg.content.toLowerCase() == "n"),
        {
          maxMatches: 1
        }
      );
      okCheck.on("end", async function(collect) {
        if (collect.first().content == "y")
          try {
            await questionsModel.addNewQuestion(question);
            message.channel.send("OK");
          } catch (e) {
            message.channel.send(
              "Something wrong,i cant save to database\n" + e
            );
          }
      });
    });
  }
};
