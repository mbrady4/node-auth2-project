const jwt = require("jsonwebtoken");

module.exports = {
  isValid,
  isValidLogin,
  createToken,
  restricted,
};

function isValid(user) {
  const result = Boolean(user.username && user.password && user.department);
  console.log(result);
  return result;
}

function isValidLogin(user) {
  const result = Boolean(user.username && user.password);
  console.log(result);
  return result;
}

function createToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department,
  };

  const secret = process.env.JWT_SECRET || "is it secret, is it safe?";

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, secret, options);
}

function restricted(req, res, next) {
  const token = req.headers.authorization;
  const secret = process.env.JWT_SECRET || "is it secret, is it safe?";

  if (token) {
    jwt.verify(token, secret, (error, decodedToken) => {
      if (error) {
        res.status(401).json({ you: "cannot pass!" });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res
      .status(401)
      .json({ message: "please provide credentials to access the resources." });
  }
}
