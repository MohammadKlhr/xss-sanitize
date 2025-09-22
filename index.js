const xss = require('xss');

/**
 * Sanitize an object recursively
 */
function sanitizeObject(obj, options = {}) {
  if (!obj || typeof obj !== 'object') return obj;

  const clean = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      clean[key] = xss(obj[key], options);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      clean[key] = sanitizeObject(obj[key], options);
    } else {
      clean[key] = obj[key];
    }
  }
  return clean;
}

/**
 * Redefine a property on req
 */
function redefine(req, prop, value) {
  Object.defineProperty(req, prop, {
    value,
    writable: true,
    configurable: true,
    enumerable: true,
  });
}

/**
 * Main middleware: sanitize req.body and req.query globally
 */
function xssSanitize(options = {}) {
  return (req, res, next) => {
    req.raw = {
      body: req.body,
      query: req.query,
    };

    if (req.body) redefine(req, 'body', sanitizeObject(req.body, options));
    if (req.query) redefine(req, 'query', sanitizeObject(req.query, options));

    next();
  };
}

/**
 * Route-level middleware: sanitize req.params
 */
xssSanitize.paramSanitize = function (options = {}) {
  return (req, res, next) => {
    req.raw = req.raw || {};
    req.raw.params = { ...req.params };

    if (req.params)
      redefine(req, 'params', sanitizeObject(req.params, options));

    next();
  };
};

module.exports = xssSanitize;
