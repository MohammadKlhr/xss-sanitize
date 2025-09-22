const express = require('express');
const xssSanitize = require('xss-sanitize');

const app = express();
app.use(express.json());
app.use(xssSanitize());

app.get('/test/:testId', xssSanitize.paramSanitize(), (req, res) => {
  res.json({
    body: req.body,
    query: req.query,
    params: req.params,

    rawBody: req.raw.body,
    rawQuery: req.raw.query,
    rawParams: req.raw.params,
  });
});

app.listen(3000, () => console.log('Test server running on port 3000'));
