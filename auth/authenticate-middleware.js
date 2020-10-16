/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const e = require("express");
const jwt = require("jsonwebtoken")

const {jwtSecret} = require("../api/config")

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token)
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        //token is invalud
        res.status(401).json({ you: "Invalid Token"}) 
      } else {
        // token is valid
        req.jwt = decodedToken
        next();
      }
    })
  } else{
    res.status(401).json({ you: 'shall not pass!' });
  }

};
