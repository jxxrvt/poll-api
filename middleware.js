const authServices = require("./auth/services");

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  if (!authServices.validateAccessToken(token)) {
    return res.status(401).json({ error: "Invalid token" });
  }

  next();
}

module.exports = {
  auth,
};
