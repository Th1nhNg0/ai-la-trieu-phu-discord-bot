const Discord = require('discord.js');
const db = require(process.env.NODE_PATH + '/handlers/db.js');

module.exports = {
  name: 'start',
  aliases: [],
  category: 'millionaire',
  description: 'Start the game',
  run: async (client, message, args) => {
    let state = await db.get('state').value();
    if (state === 'playing') {
      await message.reply('ANOTHER GAME IS PLAYING!!!!');
      return;
    }
    if (state === null) {
      await message.reply('The game not setup yet');
      return;
    }
    await db.set('state', 'playing').write();
    let questions = await db.get('questions').value();
    for (let i = 1; i <= 15; i++) {
      if (state === null) return;
      const msg = await message.channel.send(`:computer: LOADING QUESTION....`);
      try {
        await msg.react('🇦');
        await msg.react('🇧');
        await msg.react('🇨');
        await msg.react('🇩');
      } catch (err) {
        console.log('One of the emojis failed to react.');
      }
      let question = questions[i - 1];
      let answer = question.answer;
      const embed = new Discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle('Câu hỏi số ' + i)
        .setTimestamp()
        .setFooter(
          'Ai la trieu phu',
          'https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG'
        )
        .setDescription(question.question)
        .addField('Đáp án 🇦', question.A)
        .addField('Đáp án 🇧', question.B)
        .addField('Đáp án 🇨', question.C)
        .addField('Đáp án 🇩', question.D);
      await msg.edit(embed);
      let users = {};
      const filter = (reaction, user) => {
        if (user.bot || user.id in users) return false;
        users[user.id] = reaction.emoji.name;
        message.channel.send(user + ' ' + reaction.emoji.name);
        return ['🇦', '🇧', '🇨', '🇩'].includes(reaction.emoji.name);
      };
      await msg.awaitReactions(filter, { time: 15000 }).then(collected => {
        message.channel.send(`Total ${collected.size} players voted!`);
        if (collected.size === 0) {
          state = null;
          message.channel.send(`No one voted so bye :(`);
        }
        for (let id in users) {
          if (users.hasOwnProperty(id)) {
            let userAnswer = users[id];
            switch (userAnswer) {
              case '🇦':
                userAnswer = 'A';
                break;
              case '🇧':
                userAnswer = 'B';
                break;
              case '🇨':
                userAnswer = 'C';
                break;
              default:
                userAnswer = 'D';
            }
            if (userAnswer === answer) {
              message.channel.send(`<@${id}>  fucking right ✅ !!!`);
            } else message.channel.send(`<@${id}>  fucking wrong :x:  !!!`);
          }
        }
      });

      // if not lag
      // let count = 15;
      // const counter = setInterval(() => {
      //   if (count > 0) {
      //     msg.edit(count);
      //     count--;
      //   } else {
      //     clearInterval(counter);
      //   }
      // }, 1000);
    }
  }
};
