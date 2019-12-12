module.exports = {
  name: 'test',
  description: 'some test',
  run: async (client, message, args) => {
    const msg = await message.channel.send(`:computer:  TESTING....`);
    try {
      await msg.react('🇦');
      await msg.react('🇧');
      await msg.react('🇨');
      await msg.react('🇩');
    } catch (err) {
      console.log('One of the emojis failed to react.');
    }
    const filter = (reaction, user) => {
      return (
        ['🇦', '🇧', '🇨', '🇩'].includes(reaction.emoji.name) &&
        user.id === message.author.id
      );
    };
    let countdown = 10;
    const msg2 = await message.channel.send(countdown);
    msg2.edit(countdown--);
    msg
      .awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
      .then(collected => {
        const reaction = collected.first();
        console.log(reaction);
        message.reply(reaction.emoji.name);
      })
      .catch(collected => {
        message.reply('you not emoji');
      });
  }
};
