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
      },
      date: { type: Date, default: Date.now }
    }
  ]
});
userSchema.plugin(timestamps);
const User = mongoose.model("user", userSchema);

function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

async function updatePresenceTime(userID, activities, minute) {
  let user = await User.findOne({ id: userID });
  if (!user)
    user = new User({
      id: userID
    });
  activities = activities.filter(e => e.type !== "CUSTOM_STATUS");
  for (let activity of activities) {
    let findActivity = user.precenseTime.find(
      e => e.name == activity.name && sameDay(e.date, new Date())
    );
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

async function getAllTimeActivity(id) {
  let res = await User.findOne({ id }).select("precenseTime");
  let obj = {};
  res.precenseTime.forEach(e => {
    if (!obj[e.name]) obj[e.name] = 0;
    obj[e.name] += e.totalMinute;
  });
  let result = Object.keys(obj).map(function(key) {
    return { name: key, time: obj[key] };
  });
  result.sort((a, b) => b.time - a.time);
  return result;
}

async function getTopDay(guildMembers) {
  for (let [id, member] of guildMembers) {
    let query = await User.findOne({ id: id }).select("precenseTime");
    query = query ? query.precenseTime : [];
    let time = 0;
    for (let activity of query) {
      if (sameDay(activity.date, new Date())) {
        time += activity.totalMinute;
      }
    }
    member.time = time;
  }
  return guildMembers.sort((a, b) => b.time - a.time).filter(e => e.time);
}
module.exports = {
  updatePresenceTime,
  getAllTimeActivity,
  getTopDay
};
