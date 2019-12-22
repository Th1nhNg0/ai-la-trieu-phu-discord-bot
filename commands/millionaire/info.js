const db = require(process.env.NODE_PATH + '/handlers/db.js');
const Discord = require('discord.js');
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = {
  name: 'info',
  aliases: [],
  category: 'millionaire',
  description: 'Info of this game',
  //   usage: '[command]',
  run: async (client, message, args) => {
    message.delete();
    let state = await db.get('state').value();
    if (state === null) {
      message.reply('game not started yet');
      return;
    }
    let players = await db.get('players').value();
    let alivePlayers = await db.get('alivePlayers').value();
    let quesNum = await db.get('quesNum').value();
    let msg = await message.channel.send(
      new Discord.RichEmbed()
        .setColor('#28f7dc')
        .setTitle('Thông tin')
        .setTimestamp()
        .setFooter(
          'Ai la trieu phu',
          'https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG'
        )
        .addField('Câu hỏi hiện tại:', quesNum)
        .addField(
          'Danh sách người chơi:',
          players
            .map(elem =>
              alivePlayers.includes(elem) ? elem + ' ✅' : elem + ' :x:'
            )
            .join('/n')
        )
    );
  }
};
