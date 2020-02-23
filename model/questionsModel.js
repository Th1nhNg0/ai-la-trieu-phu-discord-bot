const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const questionsSchema = new mongoose.Schema({
  question: { type: String, required: true },
  A: { type: String, required: true },
  B: { type: String, required: true },
  C: { type: String, required: true },
  D: { type: String, required: true },
  answer: { type: String, required: true },
  guildId: {
    type: String,
    ref: "guildSettings"
  }
});
questionsSchema.plugin(timestamps);
const Questions = mongoose.model("questions", questionsSchema);

function addNewQuestion(data) {
  let newQues = new Questions(data);
  return newQues.save();
}

async function getQuestions(total = 15) {
  let questions = await Questions.find();
  let result = [];
  while (total--) {
    let index = Math.floor(Math.random() * questions.length);
    result.push(questions[index]);
  }
  return result;
}

module.exports = {
  getQuestions,
  addNewQuestion
};
