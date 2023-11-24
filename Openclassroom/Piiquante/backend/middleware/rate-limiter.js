const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 min window
    max: 5, // start blocking after 5 requests
    message: "Trop de tentatives de connections échouées, veuillez réessayer dans 5min."
});

module.exports = rateLimiter;