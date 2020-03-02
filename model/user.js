const Discord = require("discord.js");
const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  precenseTime: [
    {
      name: String,
      totalMinute: {
        type: Number,
        default: 0
      }
    }
  ]
});
userSchema.plugin(timestamps);
const User = mongoose.model("user", userSchema);

async function updatePresenceTime(userID, activities, minute) {
  let user = await User.findOne({ id: userID });
  if (!user)
    user = new User({
      id: userID
    });
  activities = activities.filter(e => e.type !== "CUSTOM_STATUS");
  for (let activity of activities) {
    let findActivity = user.precenseTime.find(e => e.name == activity.name);
    if (!findActivity) {
      user.precenseTime.push({
        name: activity.name,
        totalMinute: minute
      });
    } else {
      findActivity.totalMinute += minute;
    }
  }
  user.save();
}

async function getActivity(id) {
  let res = await User.findOne({ id }).select("precenseTime");
  return res ? res.precenseTime : [];
}
module.exports = {
  updatePresenceTime,
  getActivity
};
