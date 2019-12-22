const express = require('express');
const path = require('path');
const db = require('../handlers/question_db.js');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const PORT = 8080;

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/', async (req, res) => {
  let size = await db
    .get('questions')
    .size()
    .value();
  try {
    await db
      .get('questions')
      .push({ id: size, ...req.body })
      .write();
    res.send('Done');
  } catch (err) {
    res.send(err);
  }
});
app.get('/api/quesData', async (req, res) => {
  let questions = await db.get('questions').value();
  res.send(questions);
});

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
