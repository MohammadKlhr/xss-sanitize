const express = require('express');
const xssSanitize = require('./index');

const app = express();
app.use(express.json());
app.use(xssSanitize());

app.post('/test', (req, res) => {
  res.json(req.body);
});

app.listen(3000, () => console.log('Test server running on port 3000'));