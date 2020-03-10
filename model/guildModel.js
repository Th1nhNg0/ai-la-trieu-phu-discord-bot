const Discord = require("discord.js");
const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const guildSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  prefix: String,
  gameDatabase: String
});
guildSchema.plugin(timestamps);
const GuildSettings = mongoose.model("guildSettings", guildSchema);

///function
function updateDatabase(guildId, gameDatabase) {
  return GuildSettings.findOneAndUpdate({ id: guildId }, { gameDatabase });
}
function updatePrefix(guildId, prefix) {
  return GuildSettings.findOneAndUpdate({ id: guildId }, { prefix });
}

//This function is fuck :)
async function saveAllGuildSettingsToDatabase(guilds) {
  let ok = 0;
  for (let guild of guilds) {
    try {
      let newGuildSettings = new GuildSettings({ id: guild[0], prefix: "!" });
      await newGuildSettings.save();
      ok++;
    } catch (e) {
      // console.log(e);
    }
  }
  console.log(ok, "saved!");
}

function loadGuildSettings() {
  return GuildSettings.find();
}

module.exports = {
  loadGuildSettings,
  saveAllGuildSettingsToDatabase,
  updatePrefix,
  updateDatabase
};
