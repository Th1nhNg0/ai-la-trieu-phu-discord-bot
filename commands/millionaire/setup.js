const Discord = require('discord.js');
const db = require(process.env.NODE_PATH + '/handlers/db.js');
const question_db = require(process.env.NODE_PATH + '/handlers/question_db.js');

module.exports = {
  name: 'setup',
  aliases: [],
  category: 'millionaire',
  description: 'Setup the game',
  //   usage: '[command]',
  run: async (client, message, args) => {
    let state = await db.get('state').value();
    if (state === 'playing') {
      await message.reply('ANOTHER GAME IS PLAYING!!!!');
      return;
    }
    const embed = new Discord.RichEmbed()
      .setColor('#a3b5a5')
      .setTitle('Ai là triệu phú <(")')
      .setThumbnail(
        'https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG'
      )
      .setDescription('✅ To Play')
      .setTimestamp()
      .setFooter(
        'Ai la trieu phu',
        'https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG'
      )
      .addField(
        'Luật chơi',
        `Người chơi phải trả lời 15 câu hỏi với cấp độ từ dễ đến khó, thời gian suy nghĩ không hạn chế. Mỗi câu hỏi có một mức tiền thưởng, tăng dần theo thứ tự. Có ba mốc quan trọng là câu số 5, câu số 10 và câu số 15 (mốc "TRIỆU PHÚ"). Khi vượt qua các mốc này, họ chắc chắn có được số tiền thưởng tương ứng của các câu hỏi đó.
`
      )
      .addField('Command', 'type "confirm" if you ready!');
    const msg = await message.channel.send(embed);
    await msg.react('✅');
    const filter = m => {
      return (
        m.author.id === message.author.id &&
        m.content.toLowerCase() === 'confirm'
      );
    };
    message.channel
      .awaitMessages(filter, {
        max: 1,
        time: 1200000
      })
      .then(async collected => {
        let user_list = msg.reactions.first().users;
        let players = [];
        for (let user of user_list) {
          if (!user[1].bot) players.push(user[1].username);
        }
        if (players.length === 0) {
          await message.reply('No one want to play :((');
          return;
        }

        //init database
        await db.set('players', players).write();
        await db.set('alivePlayers', [...players]).write();
        await db.set('state', 'init').write();
        await db.set('quesNum', 1).write();
        await db.set('playerQues', {}).write();
        let questions = await question_db
          .get('questions')
          .random()
          .take(15)
          .value();
        await db.set('questions', questions).write();

        const embed2 = new Discord.RichEmbed()
          .setColor('#a3b5a5')
          .setTitle('Ai là triệu phú <(")')
          .setThumbnail(
            'https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG'
          )
          .setTimestamp()
          .setFooter(
            'Ai la trieu phu',
            'https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG'
          )
          .addField('Players:', players.join('\n'))
          .addField('Command:', 'Type "!start" to start the game');
        message.channel.send(embed2);
      });
  }
};
