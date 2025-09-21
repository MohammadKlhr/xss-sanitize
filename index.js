const xss = require('xss');

/**
 * xss-sanitize
 * An up-to-date alternative for xss-clean package
 * Express middleware to sanitize req.body, req.query, req.params
 *
 * @param {object} options - options for xss library
 */

function xssSanitize(options = {}) {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = xss(obj[key], options);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  return (req, res, next) => {
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);
    next();
  };
}

module.exports = xssSanitize;
