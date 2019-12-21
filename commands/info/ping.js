module.exports = {
  name: 'ping',
  aliases: [],
  category: 'info',
  description: 'Clears the chat (max: 100)',
  usage: '[command]',
  run: async (client, message, args) => {
    const msg = await message.channel.send(`🏓 Pinging....`);

    msg.edit(`🏓 Pong!
        Latency is ${Math.floor(
          msg.createdTimestamp - message.createdTimestamp
        )}ms
        API Latency is ${Math.round(client.ping)}ms`);
  }
};
