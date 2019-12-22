const express = require('express');
const path = require('path');
const question_db = require('../handlers/question_db.js');

const app = express();

const PORT = 8080;

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/api/quesData', async (req, res) => {
  let questions = await question_db.get('questions').value();
  res.send(questions);
});

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
