module.exports = {
  name: 'test',
  aliases: [],
  category: 'millionaire',
  description: 'test',
  run: async (client, message, args) => {
    let state = await db.get('gameStart').value();
    if (state === 'playing') {
      await message.reply('ANOTHER GAME IS PLAYING!!!!');
      return;
    }
    const msg = await message.channel.send(`:computer: LOADING QUESTION....`);
    try {
      await msg.react('🇦');
      await msg.react('🇧');
      await msg.react('🇨');
      await msg.react('🇩');
    } catch (err) {
      console.log('One of the emojis failed to react.');
    }
    let users = {};
    const filter = (reaction, user) => {
      if (user.bot || user.id in users) return false;
      users[user.id] = reaction.emoji.name;
      message.channel.send(user + ' ' + reaction.emoji.name);
      return ['🇦', '🇧', '🇨', '🇩'].includes(reaction.emoji.name);
    };
    const collector = msg.createReactionCollector(filter, { time: 15000 });
    collector.on('end', collected => {
      message.channel.send(`Total ${collected.size} users voted!`);
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
};
