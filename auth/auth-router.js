const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const config = require("../api/config");

const Users = require("../users/users-model");
const { isValid } = require("../users/users-service");

router.post("/register", (req, res) => {
  // implement registration
  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;

    // hash password
    const hash = bcryptjs.hashSync(credentials.password, rounds);

    credentials.password = hash;

    //save the user to the databse

    Users.add(credentials)
      .then((user) => {
        res.status(201).json({ data: user });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the password should be alphanumeric",
    });
  }
});

router.post("/login", (req, res) => {
  // implement login

  const { username, password } = req.body;
  if (isValid(req.body)) {
    Users.findBy({
      username, //returns an array a collection
    }).then(([user]) => {
      //compare the password
      if (user && bcryptjs.compareSync(password, user.password)) {
        const token = getJwt(user);

        res.status(200).json({ message: `Welcome ${username} to the database`, token})
      } else {
        res.status(401).json({message: "Invalid credentials"})
      }
    })
    .catch(error => {
      res.status(500).json({ message: error.message})
    })
  } else {
    res.status(400).json({
      message: " please provide username and password"
    })
  }
});

function getJwt(user){ //used within login to retrieve token 

const payload = {
  username: user.username,
  // role: user.role,
}

const jwtOptions = {
  expiresIn: "8h",
}

return jwt.sign(payload, config.jwtSecret, jwtOptions)

}


module.exports = router;
