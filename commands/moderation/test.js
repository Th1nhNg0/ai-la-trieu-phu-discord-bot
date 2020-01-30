module.exports = {
  name: "test",
  aliases: [],
  category: "moderation",
  description: "Test",
  usage: "",
  run: async (client, message, args) => {
    let guilds = client.guilds;
    let guild = guilds.get(message.guild.id);
    let game = guild.game;
    console.log(game);
  }
};
