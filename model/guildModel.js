const Discord = require("discord.js");
const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const guildSchema = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  prefix: String
});
guildSchema.plugin(timestamps);
const GuildSettings = mongoose.model("guildSettings", guildSchema);

///function

function updatePrefix(guildId, prefix) {
  GuildSettings.findOneAndUpdate({ _id: guildId }, { prefix });
}

//This function is fuck :)
async function saveAllGuildSettingsToDatabase(guilds) {
  let ok = 0;
  for (let guild of guilds) {
    try {
      let newGuildSettings = new GuildSettings({ _id: guild[0], prefix: "!" });
      await newGuildSettings.save();
      ok++;
    } catch (e) {}
  }
  console.log(ok, "saved!");
}

function loadGuildSettings() {
  return GuildSettings.find();
}

module.exports = {
  loadGuildSettings,
  saveAllGuildSettingsToDatabase,
  updatePrefix
};
