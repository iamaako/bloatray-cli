// All deps are used — this is a clean project
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000);
