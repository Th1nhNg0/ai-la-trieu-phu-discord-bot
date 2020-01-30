const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

require("dotenv").config();
process.env.NODE_PATH = __dirname;

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
  console.log(`Hi, ${client.user.username} is now online!`);
  client.user.setPresence({
    status: "online",
    game: {
      name: "me getting developed",
      type: "PLAYING"
    }
  });
});

client.on("message", async message => {
  const prefix = "!";

  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) command.run(client, message, args);
});

client.login(process.env.token);
