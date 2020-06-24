const bcryptjs = require("bcryptjs");
const router = require("express").Router();
const db = require("./usersModel");
const utils = require("../utils/utils");

router.post("/register", (req, res) => {
  const credentials = req.body;
  console.log(credentials);
  if (utils.isValid(credentials)) {
    const rounds = process.env.BCRTPY_ROUNDS || 8;

    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;

    db.insert(credentials)
      .then((user) => {
        res.status(201).json({ data: user });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message:
        "Please provide username and password and the password should be alphanumeric",
    });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (utils.isValidLogin(req.body)) {
    db.findBy({ username: username })
      .then((user) => {
        console.log(user);
        const token = utils.createToken(user);
        if (user && bcryptjs.compareSync(password, user.password)) {
          res.status(200).json({ token, message: "Welcome!" });
        } else {
          res.status(401).json({ message: "invalid credentials" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password",
    });
  }
});

router.get("/", utils.restricted, (req, res) => {
  db.getAll()
    .then((users) =>
      res.status(200).json({ users, decodedToken: req.decodedToken })
    )
    .catch(() => res.status(500).json({ message: "user error." }));
});

module.exports = router;
