const { readdirSync } = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Guild Settings");
table.setHeading("Guilds Name", "Load status");
const guildModel = require("../model/guildModel.js");

module.exports = async client => {
  guildModel.saveAllGuildSettingsToDatabase(client.guilds);
  let guildSettings = await guildModel.loadGuildSettings();
  for (let guild of guildSettings) {
    client.guildSettings.set(guild.id, guild);
  }
  for (let guild of client.guilds) {
    let guildId = guild[0];
    if (client.guildSettings.find(elem => elem.id == guildId)) {
      table.addRow(guild[1].name, "✅");
    } else {
      table.addRow(
        guild[1].name,
        `❌  -> missing guild settings in our database`
      );
    }
  }
  console.log(table.toString());
};
