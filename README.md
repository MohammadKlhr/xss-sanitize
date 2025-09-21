# xss-sanitize

An up-to-date replacement for the deprecated [xss-clean](https://www.npmjs.com/package/xss-clean) middleware.  
Sanitizes incoming data (`req.body`, `req.query`, `req.params`) in Express apps to prevent XSS attacks.

## Installation

```bash
npm install xss-sanitize
```

## Usage Example

```js
const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssSanitize = require('xss-sanitize');

const app = express();

app.use(express.json());         // parse JSON body
app.use(helmet());               // set secure headers
app.use(mongoSanitize());        // sanitize MongoDB queries
app.use(xssSanitize());          // sanitize all input

app.post('/create', (req, res) => {
  console.log(req.body);         // sanitized input
  res.send('Saved safely!');
});

app.listen(3000, () => console.log('Server running'));
```
> Note: Always use body parsers (`express.json()` / `express.urlencoded()`) **before** `xssSanitize()`.

## Example XSS Sanitization
```js
// Run the test server
node test.js

// POST body to localhost/3000/test: { "name": "<script>alert(1)</script>" }
// After xssSanitize:
// { "name": "&lt;script&gt;alert(1)&lt;/script&gt;" }

```

## Options

```js
app.use(xssSanitize({
  whiteList: {},                    // remove all tags
  stripIgnoreTag: true,             // remove non-whitelisted tags instead of escaping
  stripIgnoreTagBody: ['script'],   // remove script content entirely
  // optional advanced callbacks:
  onTag: function(tag, html, options) {
    console.log('Found tag:', tag);
  }
}));
```

| Option               | Description                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| `whiteList`          | An object specifying which HTML tags and attributes are allowed. Empty object `{}` removes all tags.       |
| `stripIgnoreTag`     | If `true`, removes all tags not in the whitelist instead of escaping them.                                 |
| `stripIgnoreTagBody` | If `true` and `stripIgnoreTag` is set, removes the content inside ignored tags (e.g., `<script>` content). |
| `onTag`              | Callback function for each tag found. You can modify or block tags programmatically. (needs callback)      |
| `onIgnoreTag`        | Callback function for each ignored tag. Useful for logging or custom behavior. (needs callback)            |
| `onIgnoreTagAttr`    | Callback function for each ignored attribute of a tag. (needs callback)                                    |
| `css`                | Configure how inline CSS is handled. Default is to allow safe CSS.                                         |
| `safeAttrValue`      | Callback to transform or validate attribute values (e.g., URLs in `<a href>`). (needs callback)            |
| `escapeHtml`         | If `true` (default), escapes HTML tags instead of stripping them.                                          |
| `safeProtocol`       | Array of allowed protocols in URLs (`['http', 'https', 'mailto']` by default).                             |
| `allowCommentTag`    | If `true`, preserves HTML comments; default is `false`.                                                    |


## Tips

- Combine xss-sanitize with other security middleware like helmet() and express-mongo-sanitize() for full protection.
- Middleware ordering is important: body parser → security middleware → xss-sanitize → route handlers.
- You can fully control which HTML tags are allowed or removed using whiteList and stripIgnoreTag.

## License
MIT

